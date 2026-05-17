import axiosInstance from "@/api/axiosInstance";
import GridComponent from "@/components/GridComponent";
import InputComponent from "@/components/InputComponent";
import SelectComponent from "@/components/SelectComponent";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import { useEffect, useMemo, useState } from "react";
import { set } from "react-hook-form";

dayjs.extend(duration);

interface Interval {
    intervalId: number;
    intervalName: string;
    intervalDetailDefaultJSON: string;
}

interface Routine {
    routineId: number;
    routineName: string;
    intervalId: number;
    sourcePath: string;
    sqlConnectionString: string;
    startTime: string;
    startDate: string;
    endDate: string;
}

const Routines = () => {
    const [intervals, setIntervals] = useState<Interval[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
    // const [selectedInterval, setSelectedInterval] = useState<Interval | null>(null);
    const getNewRoutine = () => {
        return {
            routineId: 0,
            routineName: '',
            intervalId: 0,
            sourcePath: '',
            sqlConnectionString: '',
            startTime: '',
            startDate: '',
            endDate: ''
        } as Routine
    };

    const [newRoutine, setNewRoutine] = useState<Routine>(getNewRoutine());

    const getIntervals = () => {
        axiosInstance.post('/routine/GetIntervals').then(r => {
            const data = r.data;
            setIntervals(data);
        })
    }

    const intervalOptions = useMemo(() => {
        return intervals.map(i => ({ label: i.intervalName, value: i.intervalId })).sort((a, b) => a.value - b.value);
    }, [intervals]);

    useEffect(() => {
        getIntervals();
        getRoutines();
    }, []);

    const getRoutines = () => {
        axiosInstance.post('/routine/GetRoutines').then(r => {
            const data = r.data;
            setRoutines(data);
        })
    }

    const saveRoutine = () => {
        const payload = {
            routineId: newRoutine.routineId,
            routineName: newRoutine.routineName,
            intervalId: newRoutine.intervalId,
            sourcePath: newRoutine.sourcePath,
            sqlConnectionString: newRoutine.sqlConnectionString,
            startTime: dayjs.duration({ hours: Number(newRoutine.startTime.split(':')[0]), minutes: Number(newRoutine.startTime.split(':')[1]) }).format('HH:mm'),
            startDate: dayjs(newRoutine.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(newRoutine.endDate).format('YYYY-MM-DD')
        } as Routine;

        axiosInstance.post('/routine/saveRoutine', payload).then(r => {
            getRoutines();
            resetNewRoutine();
            setSaveSuccess(true);
        }).catch(e => {
            setSaveSuccess(false);
        });
    }

    const resetNewRoutine = () => {
        setNewRoutine(getNewRoutine());
        setSaveSuccess(null);
    }

    const routineTableRowClick = (row: any, rowIdx: number) => {
        setNewRoutine(routines[rowIdx]);
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div>Routines Page</div>
            <div>Routines Filters</div>
            <div>
                Routines Monitors
                <GridComponent
                    headers={['Del', 'Routine Name', 'Interval', 'Source Path', 'SQL Connection String', 'Start Time', 'Start Date', 'End Date']}
                    rows={routines.map(r => [
                        '1',
                        r.routineName,
                        intervals.find(i => i.intervalId === r.intervalId)?.intervalName || '',
                        r.sourcePath,
                        r.sqlConnectionString,
                        r.startTime,
                        dayjs(r.startDate).format('MM/DD/YYYY'),
                        dayjs(r.endDate).format('MM/DD/YYYY'),
                    ])}
                    className={{ container: 'mb-4 w-130' }}
                    onRowClick={routineTableRowClick}
                    renderCell={(cell, headerName) => {
                        switch (headerName) {
                            case 'Del':
                                return <button className="text-error">Delete</button>;
                            default:
                                return <span>{String(cell)}</span>
                        }
                    }}
                />
            </div>
            <div className="mb-4">
                <button type="button" onClick={resetNewRoutine} >
                    New
                </button>
                <div>
                    {newRoutine.routineId === 0 ? 'New Routine' : 'Edit Routine'}
                </div>
                <div className="grid gap-4 justify-around grid-flow-row grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
                    {/* Input Component */}
                    <InputComponent type="text" name="Routine Name" displayLabel={true}
                        value={newRoutine.routineName}
                        onChange={(val) => setNewRoutine({ ...newRoutine, routineName: val as string })} />

                    <div className="flex flex-row items-center gap-2">
                        <label className="font-bold">Interval</label>
                        <SelectComponent options={intervalOptions}
                            isComboBox={false} allowMultiple={false} typeToSearch={false}
                            className="md:w-[25rem]" maxDropdownHeightInPX={150}
                            placeholder="Select Interval"
                            selectedIndex={Math.max(intervalOptions.findIndex(i => i.value === newRoutine.intervalId), 0)}
                            onChange={(val) => setNewRoutine({ ...newRoutine, intervalId: val as number })} />
                    </div>

                    <InputComponent type="text" name="Source Path" displayLabel={true}
                        value={newRoutine.sourcePath}
                        onChange={(val) => setNewRoutine({ ...newRoutine, sourcePath: val as string })} />

                    <InputComponent type="text" name="SQL Connection String" displayLabel={true}
                        value={newRoutine.sqlConnectionString}
                        onChange={(val) => setNewRoutine({ ...newRoutine, sqlConnectionString: val as string })} />

                    <InputComponent type="time" name="Start Time" displayLabel={true}
                        value={newRoutine.startTime}
                        onChange={(val) => setNewRoutine({ ...newRoutine, startTime: val as string })} />

                    <InputComponent type="date" name="Start Date" displayLabel={true}
                        value={dayjs(newRoutine.startDate).format('MM/DD/YYYY')}
                        onChange={(val) => setNewRoutine({ ...newRoutine, startDate: val as string })} />

                    <InputComponent type="date" name="End Date" displayLabel={true}
                        value={dayjs(newRoutine.endDate).format('MM/DD/YYYY')}
                        onChange={(val) => setNewRoutine({ ...newRoutine, endDate: val as string })} />
                </div>
            </div>
            <button type="button" onClick={saveRoutine} >
                Save
            </button>
            <div>
                {saveSuccess === null
                    ? ''
                    : saveSuccess
                        ? <label className="bg-success p-2">successful</label>
                        : <label className="bg-error p-2">unsuccessful</label>
                }
            </div>

        </div>
    );
}
export default Routines;