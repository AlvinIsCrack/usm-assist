

import type { ColorInstance } from "color";

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
    Otro = "Otr",
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