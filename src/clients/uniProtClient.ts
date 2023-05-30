const UniProtUrl="https://rest.uniprot.org/uniprotkb/search"
const ProteinInfoUrl = "https://rest.uniprot.org/uniprotkb/"

export async function searchProteins(query:string): Promise<any> {
    const response = await fetch(`${UniProtUrl}?query=${query}`);
    const data = (await response.json());
    return data.results
}

export async function getProteinInfo(query:string): Promise<any> {
    const response = await fetch(`${ProteinInfoUrl}${query}`);
    const data = (await response.json())
    return data;
}