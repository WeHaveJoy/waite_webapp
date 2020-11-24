let assert = require("assert");
let waiter = require('../waiter-availability');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/waiter_availability_test';

const pool = new Pool({
    connectionString
});


describe('The basic database Waiter Availability web app', function () {

    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from shifts");
    });


    it('should  get all the waiters', async function () {

        let Wavailability = waiter(pool);

        await Wavailability.addWaiters("Sino");
        var waiters = await Wavailability.getWaiters();
        assert.equal("Sino", waiters[0].waiter_name);

    });

    it('should get waiter by name', async function () {

        let Wavailability = waiter(pool);

        await Wavailability.addWaiters("Zizipho");
        var name = await Wavailability.getWaiterByName('Zizipho');
        //console.log(name);


        assert.deepEqual({ waiter_name: 'Zizipho' }, name)
    });

    it('should add waiters shifts', async function () {

        let Wavailability = waiter(pool);
        await Wavailability.addWaiters("Zintle")
        await Wavailability.getWaiterId("Zintle")
        await Wavailability.getSpecificDayId("Friday")
        // await Wavailability.addShifts(1,5)
        var shift = await Wavailability.addWaitersShifts(1, 5);

        assert.equal(1, 5, shift)
    });

    it('should check if the waiter is added', async function () {

        let Wavailability = waiter(pool);

        await Wavailability.addWaiters('');
        var name = await Wavailability.checkWaiters(0);

        assert.equal(false, name.rowCount == 0)
    });

    it('should add the watiers', async function () {

        let Wavailability = waiter(pool);

    
        await Wavailability.addWaiters('Nwabisa');
        var name = await Wavailability.checkWaiters(1);

        assert.equal(false, name.rowCount == 1)
    });

    // it('should get the watiers shifts', async function () {

    //     let Wavailability = waiter(pool);

    // await Wavailability.addShifts("sino", "Friday")
    //  const shifts=  await Wavailability.getShifts();
        

    //     assert.equal(false, name.rowCount == 1)
    // });
    

    it('should add shifts', async function () {

        let Wavailability = waiter(pool);
        await Wavailability.addWaiters('Nwabisa');
        var name = await Wavailability.checkWaiters(1);

        assert.equal(false, name.rowCount == 1)
    });


    // it('should join the waiters table and weekday table', async function () {

    //     let Wavailability = waiter(pool);

    //     await Wavailability.getDays()
    //    var join=  await Wavailability.joinTables();

    //     assert.equal(join, join.rows)
    // });

    after(function () {
        pool.end();
    })
});