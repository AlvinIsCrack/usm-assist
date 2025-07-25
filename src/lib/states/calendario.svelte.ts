import { SAVED_HORARIOS, STORAGE_JORNADA, STORAGE_SEDE, STORAGE_SEMESTRE } from "$lib/constants/ids";
import { generateColorForRamo } from "$lib/helpers/colors.svelte";
import { type Ramo, Días, type Bloque } from "$lib/types/horario";
import Color from "color";
import { tick } from "svelte";

// Estructura del archivo de guardado completo.
interface SavedHorarios {
    version: number;
    meta: {
        sede: string;
        jornada: string;
        semestre: string;
        exportedAt: Date;
    };
    ramos: {
        sigla: string;
        paralelo: string;
        color?: string;
    }[];
}


// --- ESTADO Y CÁLCULOS DERIVADOS REACTIVOS ---

let _jornada: string = $state("");
let _sede: string = $state("");
let _semestre: string = $state("");

let _ramoPreview: Ramo | undefined = $state(undefined);
let _ramos: Ramo[] = $state([]);
let _calendarioVisible = $derived(_ramos.length || _ramoPreview);

let _initialized = $state(false);
let _savedHorarios: { [key: string]: SavedHorarios } = $state({});
let _lockedLocation: boolean = $derived(_initialized && Boolean(_ramos.length));

// El estado derivado se calcula reactivamente cuando _ramos o _ramoPreview cambian.
const derivedState = $derived.by(() => {
    const todosLosRamos = [..._ramos.filter(r => r.sigla !== _ramoPreview?.sigla), ...(_ramoPreview ? [_ramoPreview] : [])];

    // Caso base cuando no hay ramos.
    if (todosLosRamos.length === 0) {
        return {
            range: [Días.Lunes, Días.Viernes] as [Días, Días],
            bloqueRange: [1, 8] as [number, number],
            bloquesDía: {} as { [día: number]: { [bloque: number]: Bloque[] } }
        };
    }

    const allBloques = todosLosRamos.flatMap(ramo =>
        ramo.horario.map(b => ({ ...b, ramo }))
    );

    // Cálculo del rango de días
    const días = allBloques.map(b => b.dia);
    const range: [Días, Días] = [Días.Lunes, Math.max(Días.Viernes, ...días)];

    // Cálculo del rango de bloques
    const bloquesNums = allBloques.map(b => b.bloque);
    // let minBloque = Math.min(...bloquesNums);
    // if (minBloque > 1 && minBloque % 2 === 0) {
    //     minBloque -= 1;
    // }
    const maxBloque = Math.max(8, ...bloquesNums);
    const bloqueRange: [number, number] = [1, maxBloque];

    // Creación del mapa de bloques por día
    const bloquesDía: { [día: number]: { [bloque: number]: Bloque[] } } = {};
    for (const bloque of allBloques) {
        // Sintaxis moderna para inicializar si es nulo
        (bloquesDía[bloque.dia] ??= {})[bloque.bloque] ??= [];
        bloquesDía[bloque.dia][bloque.bloque].push(bloque);
    }

    return { range, bloqueRange, bloquesDía };
});

// --- INTERFAZ PÚBLICA (MODIFICADA PARA USAR ESTADO DERIVADO) ---

export const Calendario = {
    init(localStorage: any) {
        _savedHorarios = localStorage.getItem(SAVED_HORARIOS) ? JSON.parse(localStorage.getItem(SAVED_HORARIOS)!) : [];
        _sede = localStorage.getItem(STORAGE_SEDE) ?? "";
        _jornada = localStorage.getItem(STORAGE_JORNADA) ?? "";
        _semestre = localStorage.getItem(STORAGE_SEMESTRE) ?? "";
        _initialized = true;
    },

    get sede() {
        return _sede;
    },

    get jornada() {
        return _jornada;
    },

    get semestre() {
        return _semestre;
    },

    get ramos(): Ramo[] {
        return _ramos;
    },

    get inicializado() {
        return _initialized;
    },

    get lockedLocation() {
        return _lockedLocation;
    },

    get visible() {
        return _calendarioVisible;
    },

    set sede(sede: string) {
        if (_lockedLocation) return;
        _sede = sede;
        localStorage.setItem(STORAGE_SEDE, sede);
    },

    set jornada(jornada: string) {
        if (_lockedLocation) return;
        _jornada = jornada;
        localStorage.setItem(STORAGE_JORNADA, jornada);
    },

    set semestre(semestre: string) {
        if (_lockedLocation) return;
        _semestre = semestre;
        localStorage.setItem(STORAGE_SEMESTRE, semestre);
    },

    set ramos(nuevosRamos: Ramo[]) {
        throw new Error("Esto no se puede usar!");
    },

    get range() {
        return derivedState.range;
    },

    get bloqueRange() {
        return derivedState.bloqueRange;
    },

    get bloqueRangeDifference() {
        return derivedState.bloqueRange[1] - derivedState.bloqueRange[0];
    },

    get ramoPreview() {
        return _ramoPreview;
    },

    set ramoPreview(ramo: Ramo | undefined) {
        _ramoPreview = !ramo ? undefined : {
            ...ramo,
            highlighted: true,
            color: _ramoPreview?.color && _ramoPreview.sigla === ramo.sigla ? _ramoPreview.color : generateColorForRamo(ramo.sigla, ramo.nombre)
        };
    },

    checkCollision(ramo: Ramo) {
        const bloques = _ramos.flatMap(r => r.horario);
        if (!bloques.length) return false;
        for (const bloque of ramo.horario)
            if (bloques.some(b => b.dia === bloque.dia && b.bloque === bloque.bloque))
                return true;
        return false;
    },

    hasRamo(query: { sigla?: string, paralelo?: string }) {
        let { sigla, paralelo } = query;
        return _ramos.some(r => (!sigla || r.sigla === sigla) && (!paralelo || r.paralelo === paralelo));
    },

    addRamo(ramo: Ramo) {
        this.removeRamo(ramo.sigla);
        _ramoPreview = undefined;
        _ramos = [..._ramos, { ...ramo, highlighted: undefined }];
    },

    removeRamo(sigla: string) {
        if (!_ramos.some(r => r.sigla === sigla)) return false;
        _ramos = [..._ramos.filter(r => r.sigla !== sigla)];
        if (_ramoPreview?.sigla === sigla)
            _ramoPreview = undefined;
        return true;
    },

    clear() {
        _ramos = [];
    },

    clearSaved() {
        _savedHorarios = {};
        localStorage.removeItem(SAVED_HORARIOS);
    },

    hasSaved() {
        return Object.keys(_savedHorarios).length > 0;
    },

    removeSaved(key: string) {
        if (!_savedHorarios[key]) return false;
        delete _savedHorarios[key];
        localStorage.setItem(SAVED_HORARIOS, JSON.stringify(_savedHorarios));
        return true;
    },

    getSaved() {
        return Object.keys(_savedHorarios);
    },

    save(key: string) {
        if (!_ramos.length) return;
        _savedHorarios = {
            ..._savedHorarios, [key]: {
                version: 1,
                meta: {
                    sede: _sede,
                    jornada: _jornada,
                    semestre: _semestre,
                    exportedAt: new Date()
                },
                ramos: _ramos.map(r => ({
                    sigla: r.sigla,
                    paralelo: r.paralelo,
                    color: r.color?.hexa()
                }))
            }
        };
        localStorage.setItem(SAVED_HORARIOS, JSON.stringify(_savedHorarios));
    },

    async load(key: string) {
        let parsed: SavedHorarios | undefined;
        try {
            parsed = _savedHorarios[key] as SavedHorarios;
        } catch (e) {
            alert("Error al parsear el horario guardado. Asegúrate de que el formato sea correcto.");
            return false;
        }

        _sede = parsed.meta.sede ?? "";
        _jornada = parsed.meta.jornada ?? "";
        _semestre = parsed.meta.semestre ?? "";

        const [, Data] = await Promise.all([
            tick(),
            import("$lib/data/data.svelte").then((data) => data.Data)
        ])

        if (!Data.cachedRamos) {
            alert("No se pudo cargar el horario guardado. Asegúrate de que los ramos estén disponibles.");
            return false;
        }

        const loadedRamos: Ramo[] = [];
        let notFoundCount = 0;

        for (const savedRamo of parsed.ramos) {
            const ramoData = Data.cachedRamos[savedRamo.sigla]?.[savedRamo.paralelo];

            if (ramoData) {
                const newRamo = { ...ramoData };
                // Recrea la instancia de Color a partir del string guardado.
                newRamo.color = Color(savedRamo.color);
                loadedRamos.push(newRamo);
            } else {
                notFoundCount++;
            }
        }

        _ramos = loadedRamos;
        _ramoPreview = undefined;
        return true;
    },

    getBloque(día: Días, bloque: number): Bloque[] | null {
        return derivedState.bloquesDía[día as number]?.[bloque] ?? null;
    }
};