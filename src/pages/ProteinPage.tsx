import { useParams, useSearchParams } from "react-router-dom"
import { ProteinInfo } from "../models/protein"
import { createPolymerInfoObject } from "../helpers/proteinMappingHelper"
import { DOMAttributes, useEffect, useState } from "react"
import "./ProteinPage.css"
import { Box,IconButton, Tab, Tabs } from "@mui/material"
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Typography from '@mui/material/Typography'
import { ReferenceCard } from "../components/ReferenceCard"
// @ts-ignore
import ProtvistaUniprot from "protvista-uniprot"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

const valueToTabs = [
    "details",
    "feature_viewer",
    "publications"
]

const tabsToValue:Record<string, number> = {
    "details": 0,
    "feature_viewer": 1,
    "publications": 2,
}
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
  
function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['protvista-uniprot']: CustomElement<ProtvistaUniprot>;
    }
  }
}

export const ProteinPage = () => {
    const { id } = useParams();
    const [proteinInfo, setProteinInfo] = useState<ProteinInfo>();
    const [searchParams, setSearchParams] = useSearchParams();

    const value = tabsToValue[searchParams.get("tab") ?? "details"]

    useEffect(() => {
        if (searchParams.get("tab")) {

        } else {
            setSearchParams(searchParams => {
                searchParams.set("tab", "details")
                return searchParams
            })
        }
    }, [])
    

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setSearchParams(searchParams => {
            searchParams.set("tab", valueToTabs[newValue])
            return searchParams
        })
    };

    useEffect(() => {
        async function fetch() {
            const respProtein: ProteinInfo = await createPolymerInfoObject(id!);
            setProteinInfo(respProtein);
        }
        fetch();
    }, [])

    return (
        <div className="pageContainer">
            <div className="infoHeader">
                <h2 className="proteinHeader">{proteinInfo?.entry} / {proteinInfo?.entryNames}</h2>
                <div className="organismObject">{proteinInfo?.organism}</div>
            </div>
            <div className="shortInfo">
                <h5 className="shortInfoHeader">Protein</h5>
                <p className="shortInfoContent">{proteinInfo?.proteinDescription}</p>
                <h5 className="shortInfoHeader">Gene</h5>
                <p className="shortInfoContent">{proteinInfo?.gene}</p>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '12px' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="Feature Viewer" {...a11yProps(1)} />
                    <Tab label="Publications" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div className="detailsContainer">
                <h3 className="detailsHeader">Sequence</h3>
                <table className="detailsTable">
                    <tr>
                        <td>
                            <p className="tableData">Length<br />{proteinInfo?.length}</p>
                        </td>
                        <td>
                            <p className="tableData">Last updated<br />{proteinInfo?.lastUpdated}</p>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <p className="tableData">Mass (Da)<br />{proteinInfo?.mass}</p>
                        </td>
                        <td >
                            <p className="tableData">Checksum<br />{proteinInfo?.checksum}</p>
                        </td>
                    </tr>
                </table>
                <IconButton 
                    onClick={() => {navigator.clipboard.writeText(proteinInfo?.sequence!)}}
                    sx={{
                    display: "flex",
                    borderRadius: "8px",
                    color: "#000000",
                    fontSize: "12px",
                    marginLeft: "auto",
                    marginBottom: "6px", 
                    marginTop: "-32px",               
                    }}>
                    <ContentCopyOutlinedIcon sx={{
                    width: "16px",
                    height: "16px",
                }}/>
                    <span> Copy </span>
                </IconButton>
                <div className="sequenceContainer">{proteinInfo?.sequence}</div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className="uniprotWidgetContainer">
                {/* @ts-ignore */}
                    <protvista-uniprot accession={id!} />
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className="cardsContainer">
                    {proteinInfo?.references.map(item => <ReferenceCard key={item.id} item={item} />)}
                </div>
            </TabPanel>
        </div>
    )
}