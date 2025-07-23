import { Calendario } from "$lib/states/calendario.svelte";
import type { ColorInstance } from "color";
import _ASIGNATURAS from "./horario_asignaturas.json";
import _CARRERAS from "./planes_carreras.json";
import _PROGRAMAS from "./programas_academicos.json";
import dayjs from "dayjs";

export interface Menciones {
    [mencion: string]: {
        nombre: string;
        planes: Planes;
    };
}

export interface Planes {
    [plan: string]: {
        plan: string;
        malla: Semestre[];
    };
}

export interface Semestre {
    [sigla: string]: RamoCarrera;
}

export interface Carrera {
    nombre: string;
    código: string;
    sede: string;
    jornada: string;
    "menciones/especialidades": Menciones;
}

interface RamoProgramas {
    [sigla_ramo: string]: {
        nombre: string;
        creditos: string;
        programa: string;
    };
}

export interface RamoPrograma {
    tipo: "IMPAR" | "PAR" | "AMBOS" | "ELECTIVO";
    sigla: string;
    nombre: string;
    creditos: number;
    programa: string;
}

export interface RamoCarrera {
    nombre: string;
    horas: {
        teoricas: number;
        practicas: number;
        laboratorios: number;
        ayudantias: number;
    };
    creditos: number;
    departamento: string;
    requisitos: string[][];
    equivalencias: string[][];
}

export interface Ramo {
    nombre: string;
    sigla: string;
    departamento: string;
    paralelo: string;
    profesor: string[];
    horario: Bloque[];
    cupo?: number;
    color?: ColorInstance;
    highlighted?: boolean;
}

export interface Bloque {
    bloque: number;
    tipo: TipoBloque;
    sala: string;
    campus: string;
    profesor: string;
    dia: number;
    ramo: Ramo;
}

export enum TipoBloque {
    Cátedra = "Cát",
    Ayudantía = "Ayu",
    Laboratorio = "Lab",
    Recitación = "Rec",
    Práctica = "Prá",
    Otro = "Otr"
}

export enum Días {
    Lunes = 0,
    Martes = 1,
    Miércoles = 2,
    Jueves = 3,
    Viernes = 4,
    Sábado = 5,
    Domingo = 6
}

//@ts-ignore
const ASIGNATURAS: {
    [sede: string]: {
        [jornada: string]: {
            [periodo: string]: {
                [sigla_ramo: string]: {
                    [paralelo: string]: Ramo;
                };
            };
        };
    };
    //@ts-ignore
} = _ASIGNATURAS as const;

const PROGRAMAS: {
    [sede: string]: {
        [departamento: string]: RamoPrograma[];
    };
} = Object.fromEntries(
    Object.entries(_PROGRAMAS)
        .filter(([key]) => key !== 'date') // Filtra propiedades extra como 'date'
        .map(([sede, departamentos]) => [
            sede,
            Object.fromEntries(
                Object.entries(departamentos as any).map(([depto, tipos]) => {
                    const ramos: RamoPrograma[] = [];
                    for (const [tipo, ramosPorTipo] of Object.entries(tipos as any)) {
                        for (const [sigla, ramoInfo] of Object.entries(ramosPorTipo as any)) {
                            ramos.push({
                                tipo: tipo as "IMPAR" | "PAR" | "AMBOS" | "ELECTIVO",
                                sigla,
                                //@ts-ignore
                                nombre: ramoInfo.nombre,
                                //@ts-ignore
                                creditos: parseInt(ramoInfo.creditos, 10),
                                //@ts-ignore
                                programa: ramoInfo.programa,
                            });
                        }
                    }
                    return [depto, ramos];
                })
            ),
        ])
);
let CARRERAS = _CARRERAS as Carrera[];

const _sedes = Object.keys(ASIGNATURAS);
const _jornadas: { [sede: string]: string[] } = Object.fromEntries(
    _sedes.map(sede => [
        sede,
        Object.keys(ASIGNATURAS[sede]).filter(
            jornada => Object.keys(ASIGNATURAS[sede][jornada]).some(
                semestre => Object.keys(ASIGNATURAS[sede][jornada][semestre]).length > 0
            )
        )
    ])
);
const _semestres: { [sede: string]: { [jornada: string]: string[] } } = Object.fromEntries(
    _sedes.map(sede => [
        sede,
        Object.fromEntries(
            Object.keys(ASIGNATURAS[sede]).map(jornada => [
                jornada,
                Object.keys(ASIGNATURAS[sede][jornada]).filter(semestre =>
                    Object.keys(ASIGNATURAS[sede][jornada][semestre]).length > 0
                )
            ])
        )
    ])
);
const _ramos = $derived(ASIGNATURAS[Calendario?.sede]?.[Calendario.jornada]?.[Calendario.semestre] ?? []);
let _updatedDate: dayjs.Dayjs | undefined = dayjs(+ASIGNATURAS.date * 1000);

export const Data = {
    getRamo(sede: string, jornada: string, semestre: string) {
        return ASIGNATURAS[sede]?.[jornada]?.[semestre];
    },

    /**
     * Busca la primera ocurrencia de un ramo por su sigla a través de todas las carreras y mallas.
     * @param sigla La sigla del ramo a buscar.
     * @param sede Opcional. Sede a filtrar.
     * @param jornada Opcional. Jornada a filtrar.
     * @returns El objeto RamoCarrera si se encuentra, de lo contrario undefined.
     */
    getInfoRamoCarrera(sigla: string, sede?: string, jornada?: string): RamoCarrera | undefined {
        for (const carrera of CARRERAS) {
            if (sede && carrera.sede !== sede) continue;
            if (jornada && carrera.jornada !== jornada) continue;
            for (const mencionKey in carrera["menciones/especialidades"]) {
                const mencion = carrera["menciones/especialidades"][mencionKey];
                for (const planKey in mencion.planes) {
                    const plan = mencion.planes[planKey];
                    for (const semestre of plan.malla) {
                        if (semestre[sigla]) {
                            return semestre[sigla];
                        }
                    }
                }
            }
        }
        return undefined;
    },

    /**
     * Obtiene la información de un ramo desde la estructura de PROGRAMAS,
     * buscando en todos los departamentos de una sede.
     * @param sede La sede del ramo.
     * @param sigla La sigla del ramo a buscar.
     * @returns Un objeto que combina RamoPrograma con el nombre del departamento,
     * o undefined si no se encuentra.
     */
    getProgramaRamo(sede: string, sigla: string): (RamoPrograma & { departamento: string }) | undefined {
        let sedeData = PROGRAMAS[sede];
        sedeData ??= PROGRAMAS['Campus ' + sede];
        if (!sedeData) {
            return undefined;
        }

        for (const [departamento, ramos] of Object.entries(sedeData)) {
            const ramoEncontrado = ramos.find(ramo => ramo.sigla === sigla);
            if (ramoEncontrado) {
                return {
                    ...ramoEncontrado,
                    departamento: departamento,
                };
            }
        }

        return undefined;
    },

    get sedes(): string[] {
        return _sedes.slice(0, -1);
    },

    get jornadas(): { [sede: string]: string[] } {
        return _jornadas;
    },

    get semestres(): { [sede: string]: { [jornada: string]: string[] } } {
        return _semestres;
    },

    get cachedRamos() {
        return _ramos;
    },

    get updateDate() {
        return _updatedDate;
    }
};