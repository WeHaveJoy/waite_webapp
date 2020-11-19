module.exports = function Wavailability(pool) {


    // async function workFlow(weekdayIds, waiterId) {
    //     //console.log(waiterId)
    //     if (waiterId) {
    //         //add shifts
    //         var w_id = await getWaiterId(waiterId)
    //         //console.log(w_id)
    //         var d_id = await getSpecificDayId(weekdayIds)
    //         await addShifts(w_id, d_id)
    //     } else {
    //         // delete shift
    //         await deleteUserWaitersShift(weekdayIds)
    //         // add waiters shifts
    //         await addWaitersShifts(waiterId, weekdayIds)
    //     }
    // }

    async function joinTables() {
        await pool.query(`select (weekday, waiter_name) from shifts join weekdays on shifts.weekd_id = weekdays.weekday_id join waiters on shifts.waiter_id = waiters.waiters_id`)

    }

    async function addWaiters(nameEntered) {
        var name = await pool.query(`select waiter_name from waiters where waiter_name=$1`, [nameEntered])
        if (name.rowCount == 0) {
            await pool.query(`insert into waiters (waiter_name) values($1)`, [nameEntered]);
        }
        var getId = await getWaiterId(nameEntered)
        return getId;
    }
    
    async function checkDays(days) {
        var day = await pool.query(`select weekday_id from weekdays where weekday = $1`, [days])
        return day.rowCount == 0;

    }

    // const addName =  () => await pool.query();

    async function addShifts(waiterid, weekdayIds) {
        // weekdayIds.forEach(async function (id) {
        //     await addWaitersShifts(waiterid, id);
        // });
        //console.log(waiterid);;
        var name = await addWaiters(waiterid)
        // await getWaiterId(waiterId)
        console.log(name);

        // await pool.query(`delete from shifts where waiter_id = $1`, [waiterid])
        // for (let i = 0; i < weekdayIds.length; i++) {
        //     let dayId = weekdayIds[i]
        //     console.log(dayId + " iside loop");
        //     await getSpecificDayId(weekdayIds)
        //     await pool.query(`insert into shifts(weekD_id, waiter_id) values($1, $2)`, [waiterid, dayId])
        // }
        for (const day of weekdayIds) {
            var d = await getSpecificDayId(day)
            // console.log(d.weekdayweekday_id_id);
            for (const dd of d) {
                await pool.query(`insert into shifts(weekD_id, waiter_id) values($1, $2)`, [dd.weekday_id, name])

            }

        }
    }

    async function addWaitersShifts(waiterid, weekdayid) {
        await pool.query(`insert into shifts (weekD_id, waiter_id) values($1,$2)`, [weekdayid, waiterid])
    }


    async function checkWaiters(nameEntered) {
        var names = await pool.query("select waiters_id from waiters where waiter_name=$1", [nameEntered]);
        return names.rowCount == 0
    }

    async function getWaiterId(waiterId) {
        //console.log(waiterId);
        var id = await pool.query("select waiters_id from waiters where waiter_name=$1", [waiterId]);
        //console.log(id.rows[0].waiters_id);
        return id.rows[0].waiters_id
    }

    async function deleteUserWaitersShift(name) {

        await pool.query(`delete from waiters where waiter_name = $1`, [name])
    }

    async function getWaiters() {
        var waiter = await pool.query(`select waiter_name from waiters`);
        return waiter.rows;
    }

    async function getDays() {
        var days = await pool.query(`select weekday from weekdays`)
        return days.rows
    }

    async function getWaiterByName(name) {
        const waiter = await pool.query(`select waiter_name from waiters where waiter_name=$1`, [name])
        return waiter.rows[0];
    }

    async function getSpecificDayId(dayId) {
        const day = await pool.query(`select weekday_id from weekdays where weekday = $1`, [dayId])
        // console.log(day.rows)
        return day.rows;
    }

    async function deleteDataFromWaiters() {
        await pool.query(`delete from waiters`)
    }


    return {
        addWaiters,
        getDays,
        addWaitersShifts,
        getWaiters,
        getWaiterId,
        joinTables,
        getWaiterByName,
        deleteDataFromWaiters,
        checkWaiters,
        deleteUserWaitersShift,
        addShifts,
        // workFlow,
        checkDays,
        getSpecificDayId
    }
}