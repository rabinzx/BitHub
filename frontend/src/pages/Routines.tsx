import GridComponent from "@/components/GridComponent";
import InputComponent from "@/components/InputComponent";
import SelectComponent from "@/components/SelectComponent";

const Routines = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <div>Routines Page</div>
            <div>Routines Filters</div>
            <div>
                Routines Monitors
                <GridComponent
                    headers={['Interval', 'Interval Details', 'Start Time', 'Start Date', 'End Date']}
                    rows={[['', '', '', '', '']]}
                    allowPageSizeChange={true}
                    className={{ container: 'mb-4 w-130' }}
                    allowPaginaton={true}
                    onRowClick={() => { }}
                />
            </div>
            <div>
                Add New Routine
                <div className="grid gap-4 justify-around grid-flow-row grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
                    <div className="mt-2">
                        {/* Input Component */}
                        <label>Interval</label>
                        <SelectComponent options={[{ label: 'hour', value: 'hour' }]} isComboBox={false} allowMultiple={false} typeToSearch={false}
                            comboBoxLabelField="CityName" className="md:w-[25rem] mb-4" maxDropdownHeightInPX={150}
                            placeholder="Select Interval" onChange={() => { }} />

                        <InputComponent type="integer" name="Start Time" displayLabel={true}
                            value={''} onChange={(val) => { }} />

                        <InputComponent type="date" name="Start Date" displayLabel={true}
                            value={''} onChange={(val) => { }} />

                        <InputComponent type="date" name="End Date" displayLabel={true}
                            value={''} onChange={(val) => { }} />



                    </div>
                </div>
            </div>
        </div>
    );
}
export default Routines;