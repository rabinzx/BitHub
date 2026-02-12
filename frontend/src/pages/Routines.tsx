import axiosInstance from "@/api/axiosInstance";
import GridComponent from "@/components/GridComponent";
import InputComponent from "@/components/InputComponent";
import SelectComponent from "@/components/SelectComponent";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from "react";
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
    // const [selectedInterval, setSelectedInterval] = useState<Interval | null>(null);
    const [newRoutine, setNewRoutine] = useState<Routine>({
        routineId: 0,
        routineName: '',
        intervalId: 0,
        sourcePath: '',
        sqlConnectionString: '',
        startTime: '',
        startDate: '',
        endDate: ''
    });

    const getIntervals = () => {
        axiosInstance.post('/routine/GetIntervals').then(r => {
            const data = r.data;
            setIntervals(data);
        })
    }

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
            routineId: 0,
            routineName: newRoutine.routineName,
            intervalId: newRoutine.intervalId,
            sourcePath: newRoutine.sourcePath,
            sqlConnectionString: newRoutine.sqlConnectionString,
            startTime: dayjs.duration({ hours: Number(newRoutine.startTime.split(':')[0]), minutes: Number(newRoutine.startTime.split(':')[1]) }).format('HH:mm'),
            startDate: dayjs(newRoutine.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(newRoutine.endDate).format('YYYY-MM-DD')
        } as Routine;

        axiosInstance.post('/routine/saveRoutine', payload);
    }


    return (
        <div className="flex flex-col justify-center items-center">
            <div>Routines Page</div>
            <div>Routines Filters</div>
            <div>
                Routines Monitors
                <GridComponent
                    headers={['Routine Name', 'Interval', 'Source Path', 'SQL Connection String', 'Start Time', 'Start Date', 'End Date']}
                    rows={routines.map(r => [
                        r.routineName,
                        intervals.find(i => i.intervalId === r.intervalId)?.intervalName || '',
                        r.sourcePath,
                        r.sqlConnectionString,
                        r.startTime,
                        dayjs(r.startDate).format('MM/DD/YYYY'),
                        dayjs(r.endDate).format('MM/DD/YYYY'),
                    ])}
                    allowPageSizeChange={true}
                    className={{ container: 'mb-4 w-130' }}
                    allowPaginaton={true}
                    onRowClick={() => { }}
                />
            </div>
            <div className="mb-4">
                Add New Routine
                <div className="grid gap-4 justify-around grid-flow-row grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
                    {/* Input Component */}
                    <InputComponent type="text" name="Routine Name" displayLabel={true}
                        value={newRoutine.routineName}
                        onChange={(val) => setNewRoutine({ ...newRoutine, routineName: val as string })} />

                    <div className="flex flex-row items-center gap-2">
                        <label className="font-bold">Interval</label>
                        <SelectComponent options={intervals.map(i => ({ label: i.intervalName, value: i.intervalId })).sort((a, b) => a.value - b.value)}
                            isComboBox={false} allowMultiple={false} typeToSearch={false}
                            className="md:w-[25rem]" maxDropdownHeightInPX={150}
                            placeholder="Select Interval"
                            onChange={(val) => setNewRoutine({ ...newRoutine, intervalId: val as number })} />
                    </div>

                    <InputComponent type="text" name="Source Path" displayLabel={true}
                        value={newRoutine.sourcePath}
                        onChange={(val) => setNewRoutine({ ...newRoutine, sourcePath: val as string })} />

                    <InputComponent type="text" name="SQL Connection String" displayLabel={true}
                        value={newRoutine.sqlConnectionString}
                        placeholder="Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;"
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

        </div>
    );
}
export default Routines;