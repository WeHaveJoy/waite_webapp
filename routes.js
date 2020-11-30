module.exports = function routes(Wavailability) {

    const _ = require('lodash');

    async function index(req, res) {

        res.render('index')
    }

   async function index (req, res) {

        res.render('index')
    }

    async function days (req, res) {

        // const waiters = await Wavailability.joinTables()
        res.render('days', {
            // getList: waiters
        })
    }

    async function days (req, res) {

        // const day = await Wavailability.getDays()
    
    
        const days = await Wavailability.getShifts()
       
    
        //  await Wavailability.addShifts(day, waiters)
    
        res.render('days', {
            days
        })
    }

    async function getWaiters(req, res) {
        var name = _.capitalize(req.params.username);
        
        
        const b = await Wavailability.daysChosen(name)
        console.log(b);
        
        res.render('waiters', {
            b,
            waiter_name: name
        })
    }

    async function postWaiters(req, res) {

        var name = _.capitalize(req.params.username);
        var days = req.body.checkmark;
        
    
        if (days === undefined) {
            req.flash('error', 'Please choose a day(s) that you that you would like to work on')
            res.render('waiters');
            return;
        }
        else {
            req.flash('info', 'Days has been successfully added')
            await Wavailability.addShifts(name, days)
        }
        await Wavailability.addShifts(name, days)
        
        const b = await Wavailability.daysChosen(name)
        res.render('waiters', {
            b,
            waiter_name: name,
            shift: days,
        })
    }

    async function reset (req, res) {

        await Wavailability.deleteDataFromShifts()
        req.flash('info', 'You have successfully deleted data in a database')

        res.redirect('days',)
    }

return{
    index,
    days,
    reset,
    getWaiters,
    postWaiters
}

}