import { Button, FormControl, Select, FilledInput, InputLabel, Box, MenuItem } from "@mui/material"
import { FC, useEffect, useState } from "react"
import "./Filters.css"
import { useSearchParams } from "react-router-dom"
import { FiltersValues } from "../models/filterValues"
import { getFilterOptions } from "../helpers/filterOptionsHelper"
import { Options, optionObject } from "../models/options"
import { fromToRegexp } from "../helpers/regexps"

interface Props {
    onClose: () => void
}

export const Filters: FC<Props> = ({ onClose }) => {
    const [organismOptions, setOrganismOptions] = useState<optionObject[]>([])
    const [annotationOptions, setAnnotationOptions] = useState<optionObject[]>([])
    const [withOptions, setWithOptions] = useState<optionObject[]>([])

    const [genInputValue, setGenInputValue] = useState('');
    const [organizmSelectValue, setOrganizmSelectValue] = useState<string[]>([]);
    const [fromInputValue, setFromInputValue] = useState('');
    const [toInputValue, setToInputValue] = useState('');
    const [annotationSelectValue, setAnnotationSelectValue] = useState<string[]>([]);
    const [proteinSelectValue, setProteinSelectValue] = useState<string[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        if (searchParams.has("filters")) {
            let fromValue = "";
            let toValue = ""
            const currentFilters: FiltersValues = JSON.parse(decodeURI(searchParams.get("filters")!))
            const matches = currentFilters.length?.match(fromToRegexp);
            if (matches) {
                fromValue = matches[1] === "*" ? "" : matches[1];
                toValue = matches[2] === "*" ? "" : matches[2];
            }
            setGenInputValue(currentFilters.gene ?? "");
            if (currentFilters.model_organism) {
                setOrganizmSelectValue(currentFilters.model_organism);
            }
            setFromInputValue(fromValue ?? "");
            setToInputValue(toValue ?? "");
            if (currentFilters.annotation_score) {
                setAnnotationSelectValue(currentFilters.annotation_score);
            }
            if (currentFilters.protein_with) {
                setProteinSelectValue(currentFilters.protein_with);
            }
        }
    }, [])

    const searchQuery = decodeURI(searchParams.get("query") ?? "*") as string;

    useEffect(() => {
        async function fetch() {
            const options: Options = await getFilterOptions(searchQuery);
            setOrganismOptions(options.organisms);
            setAnnotationOptions(options.annotations);
            setWithOptions(options.with);
        }
        fetch();
    }, [searchQuery])

    useEffect(() => {
        if (buttonDisabled) {setButtonDisabled(!(
            !!genInputValue
            || organizmSelectValue.length > 0
            || !!fromInputValue
            || !!toInputValue
            || annotationSelectValue.length > 0
            || proteinSelectValue.length > 0
        ))};
    }, [annotationSelectValue.length, fromInputValue, genInputValue, organizmSelectValue.length, proteinSelectValue.length, toInputValue]);

    function handleCancel() {
        onClose()
    }

    function handleApplyFilters() {
        setSearchParams(searchParams => {
            const hasFilters = !!genInputValue
                || organizmSelectValue.length > 0
                || !!fromInputValue
                || !!toInputValue
                || annotationSelectValue.length > 0
                || proteinSelectValue.length > 0;

            if (hasFilters) {
                const from = fromInputValue ? parseInt(fromInputValue) : undefined;
                const to = toInputValue ? parseInt(toInputValue) : undefined;
                const filterValues: FiltersValues = {
                    gene: genInputValue.length>0 ? genInputValue : undefined,
                    model_organism: organizmSelectValue.length > 0 ? organizmSelectValue : undefined,
                    length: (from || to) ? `[${from ?? "*"} TO ${to ?? "*"}]` : undefined,
                    annotation_score: annotationSelectValue.length > 0 ? annotationSelectValue : undefined,
                    protein_with: proteinSelectValue.length > 0 ? proteinSelectValue : undefined,
                }
                searchParams.set("filters", encodeURI(JSON.stringify(filterValues)));
            } else {
                searchParams.delete("filters");
            }
            return searchParams;
        })

        onClose()
    }

    return (
        <div className="filtersContainer">
            <h3 className="filtersHeader">Filters</h3>
            <h4 className="filterHeader">Gene Name</h4>
            <FormControl
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }} variant="filled"
            >
                <InputLabel htmlFor="gene-input">Enter gene name</InputLabel>
                <FilledInput
                    id="gene-input"
                    type={'text'}
                    sx={{ height: "52px" }}
                    value={genInputValue}
                    onInput={(event) => setGenInputValue((event.target as HTMLInputElement).value)}
                />
            </FormControl>
            <h4 className="filterHeader">Organism</h4>
            <FormControl
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }} variant="filled"
            >
                <InputLabel htmlFor="organism-input">Select options</InputLabel>
                <Select
                    id="organism-input"
                    sx={{ height: "52px" }}
                    onChange={(event) => { setOrganizmSelectValue(event.target.value as string[]) }}
                    value={organizmSelectValue}
                    multiple
                >
                    {organismOptions.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label} ({option.count})</MenuItem>))}
                </Select>
            </FormControl>
            <h4 className="filterHeader">Sequence length</h4>
            <Box component="form" noValidate sx={{ width: "90%", marginLeft: "5%", display: "flex", alignItems: "center" }}>
                <FormControl
                    sx={{ width: '40%', marginBottom: '15px', fontFamily: 'Open Sans' }}
                    variant="filled"
                >
                    <InputLabel htmlFor="from-input">From</InputLabel>
                    <FilledInput
                        id="from-input"
                        type={'number'}
                        sx={{ width: '100%', height: "52px", display: 'inline-block' }}
                        value={fromInputValue}
                        onInput={(event) => setFromInputValue((event.target as HTMLInputElement).value)}
                    />
                </FormControl>
                <hr className="rangeLine" />
                <FormControl
                    sx={{ width: '40%', marginBottom: '20px', fontFamily: 'Open Sans' }}
                    variant="filled"
                >
                    <InputLabel htmlFor="to-input">To</InputLabel>
                    <FilledInput
                        id="to-input"
                        type={'number'}
                        sx={{ width: '100%', height: "52px", display: 'inline-block' }}
                        value={toInputValue}
                        onInput={(event) => setToInputValue((event.target as HTMLInputElement).value)}
                    />
                </FormControl>
            </Box>
            <h4 className="filterHeader">Annotation score</h4>
            <FormControl
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }}
                variant="filled"
            >
                <InputLabel htmlFor="annotation-input">Select options</InputLabel>
                <Select
                    id="annotation-input"
                    sx={{ height: "52px" }}
                    multiple
                    onChange={(event) => { setAnnotationSelectValue(event.target.value as string[]) }}
                    value={annotationSelectValue}
                >
                    {annotationOptions.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label} ({option.count})</MenuItem>))}
                </Select>
            </FormControl>
            <h4 className="filterHeader">Protein with</h4>
            <FormControl
                sx={{ width: '90%', marginBottom: "15px", fontFamily: "Open Sans" }}
                variant="filled"
            >
                <InputLabel htmlFor="protein-with-input">Select</InputLabel>
                <Select
                    id="protein-with-input"
                    sx={{ height: "52px" }}
                    onChange={(event) => { setProteinSelectValue(event.target.value as string[]) }}
                    value={proteinSelectValue}
                    multiple
                >
                    {withOptions.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label} ({option.count})</MenuItem>))}
                </Select>
            </FormControl>
            <div className="buttonsContainer">
                <Button
                    onClick={handleCancel}
                    variant="text"
                    sx={{
                        width: "42%",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontFamily: "Open Sans",
                        fontSize: "14px",
                        lineHeight: "19px",
                        textTransform: "false",
                        padding: "10px 30px 10px 30px"
                    }}

                >Cancel</Button>
                <Button
                    onClick={handleApplyFilters}
                    variant="contained"
                    disabled={buttonDisabled}
                    sx={{
                        width: "42%",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontFamily: "Open Sans",
                        fontSize: "14px",
                        lineHeight: "19px",
                        textTransform: "false",
                        padding: "10px 15px 10px 15px"
                    }}
                >Apply Filters</Button>
            </div>
        </div >
    )
}