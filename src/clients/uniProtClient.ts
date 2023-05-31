import { linkRegexp } from "../helpers/regexps";

const UniProtUrl = "https://rest.uniprot.org/uniprotkb/search?fields=accession,id,gene_names,organism_name,length,cc_subcellular_location&query="
const ProteinInfoUrl = "https://rest.uniprot.org/uniprotkb/"
const OptionsURL = "https://rest.uniprot.org/uniprotkb/search?facets=model_organism,proteins_with,annotation_score&query="

export async function searchProteins(query: string, filters: string): Promise<any> {
    console.log("query:", encodeURI(`${UniProtUrl}(${query})${filters ? " AND "+filters : ""}`));
    const response = await fetch(encodeURI(`${UniProtUrl}(${query})${filters ? " AND "+filters : ""}`));
    const data = (await response.json());
    let link:string | null = null;
    if (response.headers.get("link")) {
        const match = linkRegexp.exec(response.headers.get("link")!);
        if (match && match.length >= 2) {
            link = match[1];
        } 
    }
    return {
        data: data.results,
        totalResults: response.headers.get("X-Total-Results"),
        link: link,
    }
}

export async function getNextProteins(query: string): Promise<any> {
    const response = await fetch(query);
    const data = (await response.json());
    let link: string | null = null;
    if (response.headers.get("link")) {
        const match = linkRegexp.exec(response.headers.get("link")!);
        if (match && match.length >= 2) {
            link = match[1];
        } 
    }
    return {
        data: data.results,
        totalResults: response.headers.get("X-Total-Results"),
        link: link,
    }

}

export async function getProteinInfo(query: string): Promise<any> {
    const response = await fetch(`${ProteinInfoUrl}${query}`);
    const data = response.json();
    return data;
}

export async function getOptions(query:string): Promise<any> {
    const response = await fetch(`${OptionsURL}${query}`);
    const data = await response.json();
    return data.facets
}