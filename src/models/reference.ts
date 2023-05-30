export interface Reference {
    id: number,
    authors: string,
    title: string,
    citedFor: string,
    source: string,
    pubMed: string | null,
    europePMC: string | null,
    doi: doi,
    journal: string,
    volume: number,
    firstPage: number,
    lastPage: number,
    publicationDate: number,
}

export interface doi {
    link: string | null, 
}