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

        await Wavailability.addShifts('Sino', ['Monday', 'Tuesday'])
        const selectedDays = await Wavailability.daysChosen('Sino')

        assert.deepEqual([
            {
                state: 'checked',
                weekday: 'Monday'
            },
            {
                state: 'checked',
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
            }
        ]
            , selectedDays)
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
        var name = await Wavailability.checkWaiters('Nwabisa');
        assert.equal(false, name.rowCount == 1)
    });

    it('should add shifts', async function () {

        let Wavailability = waiter(pool);

        // var name = await Wavailability.checkWaiters('Zimi');
        await Wavailability.addShifts('Zimi', ['Monday']);
        const shifts = await Wavailability.getShifts()
        assert.deepEqual( [
            {
              colors: 'needed',
              waiters: [
                'Zimi'
              ],
              weekday: 'Monday',
              weekday_id: 1
            },
            {
              colors: 'needed',
              waiters: [],
              weekday: 'Tuesday',
              weekday_id: 2
            },
            {
              colors: 'needed',
              waiters: [],
              weekday: 'Wednesday',
              weekday_id: 3
            },
            {
              colors: 'needed',
              waiters: [],
              weekday: 'Thursday',
              weekday_id: 4
            },
            {
              colors: 'needed',
              waiters: [],
              weekday: 'Friday',
              weekday_id: 5
            }
          ]
           , shifts)
    });

    it('should  delete data from shifts', async function () {
        let Wavailability = waiter(pool);

        await Wavailability.addShifts('Sino', 'Monday')
        const del = await Wavailability.deleteDataFromShifts()
        assert.equal(2, 2, del)
    })

    after(function () {
        pool.end();
    })
});