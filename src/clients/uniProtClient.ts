import { linkRegexp } from "../helpers/regexps";

const UniProtUrl = "https://rest.uniprot.org/uniprotkb/search"
const ProteinInfoUrl = "https://rest.uniprot.org/uniprotkb/"

export async function searchProteins(query: string): Promise<any> {
    const response = await fetch(`${UniProtUrl}?query=${query}`);
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
    const data = (await response.json())
    return data;
}