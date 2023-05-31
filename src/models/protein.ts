export interface Protein {
    accession: string,
    id: string,
    gene: string[],
    organism_name: string,
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