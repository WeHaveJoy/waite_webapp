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

    it('should  get all the days', async function () {

        let Wavailability = waiter(pool);

        await Wavailability.addDays("Sunday");
        var days = await Wavailability.getDays();
        assert.equal("Sunday", days[0].weekday);

    });


    it('should get waiter by name', async function () {

        let Wavailability = waiter(pool);

        await Wavailability.addWaiters("Zizipho");
        var name = await Wavailability.getWaiterByName('Zizipho');
        //console.log(name);


        assert.deepEqual({ waiter_name: 'Zizipho' }, name)
    });

    it('should pass the test for the check boxes to remain checked when the waiter has selected their days.', async function () {

        let Wavailability = waiter(pool);
        
        const days = Wavailability.daysChosen()
        await Wavailability.workingDays(days)
        assert.deepEqual([
            {
                weekday: 'Sunday'
              },
            {
              weekday: 'Monday'
            },
            {
              weekday: 'Tuesday'
            },
            {
              weekday: 'Wednesday'
            },
            {
              weekday: 'Thursday'
            },
            {
              weekday: 'Friday'
            },
            {
                weekday: 'Saturday'
              },
          ]
          , await Wavailability.daysChosen())
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

       
    //    var join=  await Wavailability.getShifts();
    //    await Wavailability.workingDays(join)

    //     assert.deepEqual([
    //         {
    //           waiters: [],
    //           weekday: 'Monday',
    //           weekday_id: 1
    //         },
    //         {
    //           waiters: [],
    //           weekday: 'Tuesday',
    //           weekday_id: 2
    //         },
    //         {
    //           waiters: [],
    //           weekday: 'Wednesday',
    //           weekday_id: 3
    //         },
    //         {
    //           waiters: [],
    //           weekday: 'Thursday',
    //           weekday_id: 4
    //         },
    //         {
    //           waiters: [],
    //           weekday: 'Friday',
    //           weekday_id: 5
    //         }
    //       ]
          
    //        , await Wavailability.workingDays())
    // });

    it('should  delete data from shifts', async function () {
        let Wavailability = waiter(pool);

        await Wavailability.deleteDataFromShifts()
        
    })


    after(function () {
        pool.end();
    })
});