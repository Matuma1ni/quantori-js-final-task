import { UniprotProtein, UniprotResponse } from "../models/UniprotResponse";
import { linkRegexp } from "../helpers/regexps";

const UniProtUrl = "https://rest.uniprot.org/uniprotkb/search?fields=accession,id,gene_names,organism_name,length,cc_subcellular_location&query="
const ProteinInfoUrl = "https://rest.uniprot.org/uniprotkb/"
const OptionsURL = "https://rest.uniprot.org/uniprotkb/search?facets=model_organism,proteins_with,annotation_score&query="

export async function searchProteins(query: string, filters: string, sort: string|null): Promise<UniprotResponse> {
    console.log("query:", encodeURI(`${UniProtUrl}(${query})${filters ? " AND "+filters : ""}${sort ? "&sort="+sort : ""}`));
    const response = await fetch(encodeURI(`${UniProtUrl}(${query})${filters ? " AND "+filters : ""}${sort ? "&sort="+sort : ""}`));
    const data = (await response.json()) as {results: UniprotProtein[]};
    let link:string | null = null;
    if (response.headers.get("link")) {
        const match = linkRegexp.exec(response.headers.get("link")!);
        if (match && match.length >= 2) {
            link = match[1];
        } 
    }
    return {
        data: data.results,
        totalResults: parseInt(response.headers.get("X-Total-Results") ?? "0"),
        link: link,
    }
}

export async function getNextProteins(query: string): Promise<UniprotResponse> {
    const response = await fetch(query);
    const data = (await response.json()) as {results: UniprotProtein[]};
    let link: string | null = null;

    link = extractLink(response);

    return {
        data: data.results,
        totalResults: parseInt(response.headers.get("X-Total-Results") ?? "0"),
        link: link,
    }
}

function extractLink(response: Response) {
    if (response.headers.get("link")) {
        const match = linkRegexp.exec(response.headers.get("link")!);
        if (match && match.length >= 2) {
            return match[1];
        } 
    }
    return null;
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