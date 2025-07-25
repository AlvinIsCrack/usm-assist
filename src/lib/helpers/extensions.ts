declare global {
    interface String {
        deaccent(): string;
    }
}

String.prototype.deaccent = function (): string {
    return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export { };