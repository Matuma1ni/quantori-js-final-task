export interface Reference {
    id: number,
    authors: string,
    title: string,
    citedFor: string,
    source: string,
    pubMed: string | null,
    europePMC: string | null,
    doi: Doi,
    journal: string,
    volume: number,
    firstPage: number,
    lastPage: number,
    publicationDate: number,
}

export interface Doi {
    link: string | null, 
}