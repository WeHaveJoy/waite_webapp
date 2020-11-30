module.exports = function Wavailability(pool) {

    async function getShifts() {
        const weekdays = await getDays()
        const shifts = await joinTables()

        weekdays.forEach(day => {
            day.waiters = [];

            shifts.forEach(waiter => {
                if (waiter.weekday == day.weekday) {
                    day.waiters.push(waiter.waiter_name)
                }
                //console.log(day.waiters);

                if (day.waiters.length < 3) {
                    day.colors = 'needed'
                } else if (day.waiters.length === 3) {
                    day.colors = 'good'
                } else if (day.waiters.length > 3) {
                    day.colors = 'over'
                }
            })

        });
        //console.log(weekdays);

        return weekdays;
    }

    async function joinTables() {
        const join = await pool.query(`select weekday, waiter_name from shifts join weekdays on shifts.weekd_id = weekdays.weekday_id join waiters on shifts.waiter_id = waiters.waiters_id`)
        return join.rows;

    }

    // async function displayDays() {
    //     var days = await pool.query(`select weekday from weekdays`)
    //     return days.rows;
    // }

    async function addWaiters(nameEntered) {
        var name = await pool.query(`select waiter_name from waiters where waiter_name=$1`, [nameEntered])
        if (name.rowCount == 0) {
            await pool.query(`insert into waiters (waiter_name) values($1)`, [nameEntered]);
        }
        var getId = await getWaiterId(nameEntered)
        return getId;
    }

    async function addDays(dayChosen) {
        var days = await pool.query(`select weekday from weekdays where weekday=$1`, [dayChosen]);
        return days.rows;
    }


    async function workingDays(user) {
        var days = await pool.query(`select weekday from shifts join weekdays on shifts.weekd_id = weekdays.weekday_id join waiters on shifts.waiter_id = waiters.waiters_id where waiter_name=$1`, [user]);
        return days.rows;
    }

    async function daysChosen(user) {
        // const days = await pool.query(`select weekday from shifts where waiter_name = $1`, [day])
        // const d = days.rows;
        var days = await workingDays(user)
        // console.log(days);

        const weekd = await pool.query(`select weekday from weekdays`)
        const w = weekd.rows;

        w.forEach(chosenDays1 => {
            // console.log(chosenDays1.weekday);
            days.forEach(work => {


                if (chosenDays1.weekday === work.weekday) {
                    chosenDays1.state = "checked"
                }
            });

        })

        return w;
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
        // console.log(name);

        await pool.query(`delete from shifts where waiter_id = $1`, [name])
        // for (let i = 0; i < weekdayIds.length; i++) {
        //     let dayId = weekdayIds[i]
        //     console.log(dayId + " iside loop");
        //     await getSpecificDayId(weekdayIds)
        //     await pool.query(`insert into shifts(weekD_id, waiter_id) values($1, $2)`, [waiterid, dayId])
        // }
        console.log(waiterid);

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
        var days = await pool.query(`select * from weekdays`)
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

    async function deleteDataFromShifts() {
        await pool.query(`delete from shifts`)
    }


    return {
        addWaiters,
        getDays,
        addWaitersShifts,
        getWaiters,
        getWaiterId,
        joinTables,
        getWaiterByName,
        deleteDataFromShifts,
        checkWaiters,
        deleteUserWaitersShift,
        addShifts,
        checkDays,
        //  displayDays,
        daysChosen,
        addDays,
        workingDays,
        getSpecificDayId,
        getShifts
    }
}


