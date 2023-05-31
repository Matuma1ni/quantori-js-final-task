import { Options, optionObject } from "../models/options";
import { getOptions } from "../clients/uniProtClient";

export async function getFilterOptions(query: string): Promise<Options> {
    const data = await getOptions(query)

    function createListOptionObjects(name: string): optionObject[] {
        const values = data.find((option: any) => option.name===name).values;
        const objects = values.map((object: any) => ({label: object.label ?? object.value, value: object.value, count: object.count}));
        return objects
    }

    return {
        organisms: createListOptionObjects("model_organism"),
        annotations: createListOptionObjects("annotation_score"),
        with: createListOptionObjects("proteins_with"),
    } 


} 