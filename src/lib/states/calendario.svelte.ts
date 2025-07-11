export interface Ramo {
    nombre: string;
    sigla: string;
    departamento: string;
    paralelo: string;
    profesores: string[];
    horario: Bloque[];
    cupo?: number;
}

export interface Bloque {
    bloque: number;
    tipo: TipoBloque;
    sala: string;
    campus: string;
    profesor: string;
    dia: number;
}

export type TipoBloque = "Ayu" | "Cát" | "Otr" | "Lab" | "Rec" | "Prá";

export enum Días {
    Lunes = 1,
    Martes = 2,
    Miércoles = 3,
    Jueves = 4,
    Viernes = 5,
    Sábado = 6,
    Domingo = 7
}


let _jornada: string = $state("");
let _sede: string = $state("");
let _semestre: string = $state("")

let _ramos: Ramo[] = $state([]);
let _range: [Días, Días] = $state([Días.Lunes, Días.Viernes]);
let _bloqueRange: [number, number] = $state([1, 8]);
let _bloquesDía: {
    [día: number]:
    { [bloque: number]: Bloque }
} = $state({})

export const Calendario = {
    get sede() {
        return _sede;
    },

    get jornada() {
        return _jornada;
    },

    get ramos(): Ramo[] {
        return _ramos;
    },

    set sede(sede: string) {
        _sede = sede;
    },

    set jornada(jornada: string) {
        _jornada = jornada;
    },

    set semestre(semestre: string) {
        _semestre = semestre;
    },

    set ramos(nuevosRamos: Ramo[]) {
        _ramos = nuevosRamos;

        const bloques = _ramos.flatMap(ramo => ramo.horario.map(b => b.bloque));
        _bloqueRange = [Math.min(...bloques, 1), Math.max(...bloques, 8)];

        _bloquesDía = {};
        _ramos.forEach(ramo => {
            ramo.horario.forEach(bloque => {
                if (!(bloque.dia in _bloquesDía))
                    _bloquesDía[bloque.dia] = {};
                _bloquesDía[bloque.dia][bloque.bloque] = bloque;
            })
        });
    },

    get range() {
        return _range;
    },

    get bloqueRange() {
        return _bloqueRange;
    },

    addRamo(ramo: Ramo) {
        _ramos.push(ramo);
    },

    clear() {
        _ramos = [];
    },

    getBloquesDía(día: Días): Bloque[] {
        return Object.values(_bloquesDía[día as number] ?? {});
    },

    getBloque(día: Días, bloque: number): Bloque | null {
        return _bloquesDía[día as number]?.[bloque] ?? null;
    }
};