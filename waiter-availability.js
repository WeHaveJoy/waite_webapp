module.exports = function Wavailability(pool) {


    async function workFlow(waiterName, weekdayIds) {
        if (await checkWaiters(waiterName)) {
            //add shifts
            await addShifts(weekdayIds)
        } else {
            // delete shift
            await deleteUserWaitersShift(weekdayIds)
            // add shifts
            await addShifts(weekdayIds)

        }

    }

    async function joinTables() {
        await pool.query(`select (weekday, waiter_name) from shifts join weekdays on shifts.weekd_id = weekdays.weekday_id join waiters on shifts.waiter_id = waiters.waiters_id`)

    }

    async function addWaiters(nameEntered) {
        await pool.query(`insert into waiters (waiter_name) values($1)`, [nameEntered]);

    }

    // const addName =  () => await pool.query();

    async function addShifts(waiterid, weekdayIds) {
        weekdayIds.forEach(async function (id) {
            await addWatersShifts(waiterid, id);
        });
    }

    async function addWaitersShifts(waiterid, weekdayid) {
        await pool.query(`insert into shifts (weekD_id, waiter_id) values($1,$2)`, [weekdayid, waiterid])
    }

    async function checkWaiters(nameEntered) {
        var names = await pool.query("select waiters_id from waiters where waiter_name=$1", [nameEntered]);
        return names.rowCount == 0
    }

    async function getWaiterId(waiterId){
        var id = await pool.query("select waiters_id from waiters where waiter_name=$1", [waiterId]);
        return id.rows
    }


    async function deleteUserWaitersShift(name) {

        await pool.query(`delete from waiters where waiter_name = $1`, [name])
    }

    async function getWaiters() {
        var waiter = await pool.query(`select waiter_name from waiters`);
        return waiter.rows;
    }


    async function getWaiterByName(name) {
        const waiter = await pool.query(`select waiter_name from waiters where waiter_name=$1`, [name])
        return waiter.rows[0];

    }

    async function getSpecificDayId(dayId) {
        const day = await pool.query(`select weekday_id from weekdays where weekday = $1`, [dayId])
        return day.rows[0];
    }


    return {
        addWaiters,
        addWaitersShifts,
        getWaiters,
        getWaiterId,
        joinTables,
        getWaiterByName,
        checkWaiters,
        deleteUserWaitersShift,
        addShifts,
        workFlow,
        getSpecificDayId
    }
}