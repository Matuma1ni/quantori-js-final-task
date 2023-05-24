export interface Protein {
    index: number,
    entry: string,
    entryNames: string,
    genes: string[],
    organism: string,
    subcellularLocation: string[],
    length: number,
}