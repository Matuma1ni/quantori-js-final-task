export interface Protein {
    entry: string,
    entryNames: string,
    genes: string,
    organism: string,
    subcellularLocation: string,
    length: number,
}

export interface ProteinInfo {
    entry: string,
    entryNames: string, 
    organism: string,
    proteinDescription: string,
    gene: string, 
    length: number, 
    lastUpdated: string,
    mass: number,
    checksum: string,
    references: any[],
    sequence: string,
}