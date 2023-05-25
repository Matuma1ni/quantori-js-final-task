import { useParams } from "react-router-dom"
import { ProteinInfo } from "../models/protein"
import { createPolymerInfoObject } from "../helpers/proteinMappingHelper"
import { useEffect, useState } from "react"
import "./ProteinPage.css"
import { Box, Tab, Tabs } from "@mui/material"
import Typography from '@mui/material/Typography'
import { ReferenceCard } from "../components/ReferenceCard"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
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

export const ProteinPage = () => {
    const { id } = useParams();
    const [proteinInfo, setProteinInfo] = useState<ProteinInfo>();
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        async function fetch() {
            const respProtein: ProteinInfo = await createPolymerInfoObject(id!);
            setProteinInfo(respProtein);
            console.log(respProtein);
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
                <h3 className="detailsHeader">Sequence</h3>
                <table className="detailsTable">
                    <tr>
                        <td>
                            <p>Length<br />{proteinInfo?.length}</p>
                        </td>
                        <td>
                            <p>Last updated<br />{proteinInfo?.lastUpdated}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Mass (Da)<br />{proteinInfo?.mass}</p>
                        </td>
                        <td>
                            <p>Checksum<br />{proteinInfo?.checksum}</p>
                        </td>
                    </tr>
                </table>
                <div className="sequenceContainer">{proteinInfo?.sequence}</div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className="cardsContainer">
                    {proteinInfo?.references.map(item => <ReferenceCard key={item.id} item={item} />)}
                </div>
            </TabPanel>
        </div>
    )
}