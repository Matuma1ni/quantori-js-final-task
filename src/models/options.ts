export interface Options {
    organisms: OptionObject[],
    annotations: OptionObject[],
    with: OptionObject[]
}

export interface OptionObject {
    value: string,
    label: string,
    count: number, 
}