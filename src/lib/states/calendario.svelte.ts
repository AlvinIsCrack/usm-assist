import { STORAGE_JORNADA, STORAGE_SEDE, STORAGE_SEMESTRE } from "$lib/constants/ids";
import { generateColorForRamo } from "$lib/helpers/colors.svelte";
import { type Ramo, Días, type Bloque } from "$lib/types/horario";
import Color from 'color';

// --- INTERFACES PARA LA SERIALIZACIÓN ---
// Estructura de datos para un ramo guardado.
interface SavedRamo {
    sigla: string;
    paralelo: string;
    color: string; // El color se guarda como un string hexadecimal.
}

// Estructura del archivo de guardado completo.
interface SaveData {
    version: number;
    meta: {
        sede: string;
        jornada: string;
        semestre: string;
        exportedAt: string;
    };
    ramos: SavedRamo[];
}

const SAVE_FILE_VERSION = 1;


// --- ESTADO Y CÁLCULOS DERIVADOS REACTIVOS ---

let _jornada: string = $state("");
let _sede: string = $state("");
let _semestre: string = $state("");

let _ramoPreview: Ramo | undefined = $state(undefined);
let _ramos: Ramo[] = $state([]);
let _calendarioVisible = $derived(_ramos.length || _ramoPreview);

let _initialized = $state(false);
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

function _handleLoadedData(
    data: SaveData
) {
    if (typeof data.version !== 'number' || !data.ramos) {
        throw new Error('El archivo no tiene un formato de horario válido.');
    }

    // El switch permite manejar diferentes versiones del archivo en el futuro.
    switch (data.version) {
        case 1:
            _loadV1(data);
            break;
        default:
            throw new Error(`Versión de archivo no soportada: ${data.version}.`);
    }
}

async function _loadV1(data: SaveData) {
    const Data = await import("$lib/data/data.svelte").then((data) => data.Data);

    const loadedRamos: Ramo[] = [];
    let notFoundCount = 0;

    for (const savedRamo of data.ramos) {
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

    // Actualiza el estado de la aplicación.
    _ramos = loadedRamos;
    _sede = data.meta.sede;
    _jornada = data.meta.jornada;
    _semestre = data.meta.semestre;

    // Persiste la nueva ubicación en localStorage.
    localStorage.setItem(STORAGE_SEDE, _sede);
    localStorage.setItem(STORAGE_JORNADA, _jornada);
    localStorage.setItem(STORAGE_SEMESTRE, _semestre);

    if (notFoundCount > 0) {
        alert(
            `${notFoundCount} ramo(s) del archivo no se encontraron en la oferta académica actual y fueron omitidos.`
        );
    }
}

// --- INTERFAZ PÚBLICA (MODIFICADA PARA USAR ESTADO DERIVADO) ---

export const Calendario = {
    init(localStorage: any) {
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
        return true;
    },

    clear() {
        _ramos = [];
    },

    save() {
        if (!_ramos.length) return;

        const savedRamos: SavedRamo[] = _ramos.map((ramo) => ({
            sigla: ramo.sigla,
            paralelo: ramo.paralelo,
            color: ramo.color!.hexa() // Convierte la instancia de Color a un string #RRGGBB
        }));

        const saveData: SaveData = {
            version: SAVE_FILE_VERSION,
            meta: {
                sede: _sede,
                jornada: _jornada,
                semestre: _semestre,
                exportedAt: new Date().toISOString()
            },
            ramos: savedRamos
        };

        const jsonString = JSON.stringify(saveData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);

        a.href = url;
        a.download = `horario-usm-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    load(): Promise<void> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.style.display = 'none';

            const cleanup = () => document.body.removeChild(input);

            input.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (!file) {
                    cleanup();
                    return reject(new Error('No se seleccionó ningún archivo.'));
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string) as SaveData;
                        _handleLoadedData(data);
                        resolve();
                    } catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        alert(`Error al procesar el archivo: ${message}`);
                        reject(error);
                    } finally {
                        cleanup();
                    }
                };
                reader.onerror = (error) => {
                    cleanup();
                    reject(error);
                };
                reader.readAsText(file);
            };

            input.oncancel = () => {
                cleanup();
                reject(new Error('Carga de archivo cancelada.'));
            };

            document.body.appendChild(input);
            input.click();
        });
    },

    getBloque(día: Días, bloque: number): Bloque[] | null {
        return derivedState.bloquesDía[día as number]?.[bloque] ?? null;
    }
};