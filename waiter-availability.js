module.exports = function Wavailability(pool) {

    async function addWaiters(nameEntered) {
        var names = await pool.query("select waiters_id from waiters ");
        if (names.rowCount == 0) {

            await pool.query("insert into waiters(waiter_name) values($1)", [nameEntered]);
        }
    }

    async function getWaiters() {
        var waiter = await pool.query("select waiter_name values($1)");
        return waiter.rows;
    }




    return {
        addWaiters,
        getWaiters
    }
}