import axiosInstance from "@/api/axiosInstance";
import GridComponent from "@/components/GridComponent";
import InputComponent from "@/components/InputComponent";
import ModalComponent from "@/components/ModelComponent";
import SelectComponent from "@/components/SelectComponent";
import { useEffect, useState } from "react";

interface DataType {
    dataTypeId: number,
    typeName: string
}

interface Mappings {
    mappingId: number,
    description: string,
    createdDate: string,
}

interface MappingDetails {
    //MappingDetailId, OrdinalPosition, MutationJSON, OutputName, OutputDataTypeId
    mappingDetailId: number,
    ordinalPosition: number,
    mutationJSON: string,
    outputName: string,
    outputDataTypeId: number,
}

interface NewOrEditMappingDetails extends MappingDetails {
    index: number;
}


enum DetailsModalMode {
    New = 'New',
    Edit = 'Edit'
}

const MappingForm = () => {
    const getBlankMappingDetail = (): NewOrEditMappingDetails => {
        return {
            index: -1,
            mappingDetailId: 0,
            ordinalPosition: 0,
            mutationJSON: '',
            outputName: '',
            outputDataTypeId: 1
        }
    };

    const [dataTypes, setDataTypes] = useState<DataType[]>([]);
    const [mappings, setMappings] = useState<Mappings[]>([]);
    const [mappingDetails, setMappingDetails] = useState<MappingDetails[]>([]);
    const [newMappingDetails, setNewMappingDetails] = useState<NewOrEditMappingDetails>(getBlankMappingDetail());
    const [newMappingModalVisible, setNewMappingModalVisible] = useState<boolean>(false);
    const [detailsModalMode, setDetailsModalMode] = useState<DetailsModalMode>(DetailsModalMode.New);
    const [selectedMappingId, setSelectedMappingId] = useState<number | null>(null);

    const getDataTypes = () => {
        axiosInstance.post('/Mapping/GetDataTypes').then(r => {
            const data = r.data;
            setDataTypes(data);
        })
    }

    const getMappings = () => {
        axiosInstance.post('/Mapping/GetMappings').then(r => {
            const data = r.data;
            setMappings(data);
        })
    }

    const getMappingDetails = (mappingId: number) => {
        axiosInstance.post('/Mapping/GetMappingDetails', { mappingId }).then(r => {
            const data = r.data;
            setMappingDetails(data);
        })
    }

    useEffect(() => {
        getDataTypes();
        getMappings();
    }, []);

    const mappingTableRowClick = (row: any, rowIdx: number) => {
        setSelectedMappingId(mappings[rowIdx].mappingId);
        getMappingDetails(mappings[rowIdx].mappingId);
    }

    const addMappingDetail = () => {
        setDetailsModalMode(DetailsModalMode.New);
        setNewMappingModalVisible(true);
        setNewMappingDetails(getBlankMappingDetail());
    }

    const updateNewMappingDetails = (key: string, value: any) => {
        setNewMappingDetails((prev) => ({ ...prev, [key]: value }));
    }

    const mappingModalCancelHandler = () => {
        setNewMappingModalVisible(false);
        setNewMappingDetails(getBlankMappingDetail());
    }

    const mappingDetailsRowClickHandler = (_: any, idx: number) => {
        setDetailsModalMode(DetailsModalMode.Edit);
        setNewMappingModalVisible(true);
        setNewMappingDetails({ ...mappingDetails[idx], index: idx });
    }

    const saveNewOrEditMappingDetail = () => {
        const { index, ...tempNewMappingDetails } = newMappingDetails;
        if (detailsModalMode === DetailsModalMode.Edit && index >= 0) {
            setMappingDetails(prev =>
                prev.map((d, i) =>
                    i === index ? tempNewMappingDetails as MappingDetails : d
                )
            );
        }
        if (detailsModalMode === DetailsModalMode.New) {
            setMappingDetails((prev) => [...prev, tempNewMappingDetails as MappingDetails]);
        }
        setNewMappingModalVisible(false);
        setNewMappingDetails(getBlankMappingDetail());
    }

    const saveMappingDetails = () => {
        axiosInstance.post('/Mapping/saveMappingDetails', { mappingId: selectedMappingId, mappingDetails: mappingDetails }).then(r =>
            getMappingDetails(selectedMappingId!)
        )
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">Mapping Form</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Mappings</label>
                    <GridComponent headers={['Id', 'Name', 'CreatedDate']} rows={mappings.map(m => [m.mappingId, m.description, m.createdDate])} allowPageSizeChange={true}
                        className={{ container: 'mb-4 w-130' }}
                        allowPaginaton={true}
                        onRowClick={mappingTableRowClick}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="description">Modification Area</label>
                    <div className="mb-2 flex justify-start gap-2">
                        <button type="button" onClick={addMappingDetail}>Add</button>
                    </div>
                    <GridComponent headers={['Column', 'Type', 'Mapping', 'Output Name', 'Output']}
                        rows={mappingDetails.map(m => [m.ordinalPosition, dataTypes.find(d => d.dataTypeId === m.outputDataTypeId)?.typeName || '', '', m.outputName, 'test'])}
                        allowPageSizeChange={true}
                        className={{ container: 'mb-4 w-130' }}
                        allowPaginaton={false}
                        onRowClick={mappingDetailsRowClickHandler}
                    />
                    <ModalComponent hasBackdrop={true} displayModal={newMappingModalVisible} modalSize="md" title={String(detailsModalMode)}
                        modalCloseHandler={() => setNewMappingModalVisible(false)}
                        cancelHandler={mappingModalCancelHandler}
                        submitHandler={saveNewOrEditMappingDetail}
                    >
                        <div className="grid py-2 grid-cols-2 gap-x-2 gap-y-2 auto-rows-min items-center">
                            <label htmlFor="Column">Column</label>
                            <InputComponent type="integer" name="Column" displayLabel={false}
                                value={newMappingDetails?.ordinalPosition} onChange={(val) => updateNewMappingDetails('ordinalPosition', +val)} />
                            <label htmlFor="type">Type</label>
                            <SelectComponent options={dataTypes.map((d) => ({ label: d.typeName, value: d.dataTypeId }))}
                                className="md:w-[25rem] self-center" maxDropdownHeightInPX={150}
                                selectedIndex={dataTypes.findIndex(d => d.dataTypeId === newMappingDetails.outputDataTypeId)}
                                placeholder="Select Type" onChange={(val) => updateNewMappingDetails('outputDataTypeId', val)} />
                            <label htmlFor="outputName">Mapping</label>
                            <div>[Mappings]</div>
                            <label htmlFor="outputName">Output Name</label>
                            <InputComponent type="text" name="Output Name" displayLabel={false}
                                value={newMappingDetails?.outputName} onChange={(val) => updateNewMappingDetails('outputName', val)} />
                        </div>
                    </ModalComponent>
                </div>
                <button type="button" onClick={saveMappingDetails} >
                    Save
                </button>
            </form>
        </div>
    );
}

export default MappingForm;