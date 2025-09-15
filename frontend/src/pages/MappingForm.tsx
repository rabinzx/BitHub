import axiosInstance from "@/api/axiosInstance";
import GridComponent from "@/components/GridComponent";
import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";
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

const MappingForm = () => {
    const [dataTypes, setDataTypes] = useState<DataType[]>([]);
    const [mappings, setMappings] = useState<Mappings[]>([]);
    const [mappingDetails, setMappingDetails] = useState<MappingDetails[]>([]);

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
        getMappingDetails(mappings[rowIdx].mappingId);
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
                    <GridComponent headers={['Column', 'Type', 'Mapping', 'Output Name', 'Output']}
                        rows={mappingDetails.map(m => [m.ordinalPosition, dataTypes.find(d => d.dataTypeId = m.outputDataTypeId)?.typeName || '', '', m.outputName, ''])}
                        allowPageSizeChange={true}
                        className={{ container: 'mb-4 w-130' }}
                        allowPaginaton={true}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="type">Status</label>
                </div>
                <button type="submit">
                    Save
                </button>
            </form>
        </div>
    );
}

export default MappingForm;