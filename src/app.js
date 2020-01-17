const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

 
console.log(__dirname)
console.log(path.join(__dirname,'../public'))


const app = express()
// Define path for Express Config
const PublicDirectoryPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views location
app.set('views',viewPath)
app.set('view engine','hbs') 
hbs.registerPartials(partialsPath)

//Setup static directory to serv
app.use(express.static(PublicDirectoryPath))

app.get('',(req,res) => {
        res.render('index', {
            title: 'Weather App',
            Author: 'Ajay Rengunthwar'
        })
}) 

app.get('/about',(req,res) => {
        res.render('about',{
            title :'About me',
            Author :'Demo Dewbot'
        })
})

app.get('/help',(req,res) => {
    res.render('help',{
        title:'Weather Info',
        Author: 'Ajay Rengunthwar'
    })
})

app.get('/weather',(req,res) => {
    if (!req.query.address) {
        return res.send({error: 'adress required part of search'                  
         })
        }
    
    geocode(req.query.address,(error,{latitude,longitude,location} = {}) => {
        if (error)
        {
            return res.send({error})
        }

        forecast(latitude,longitude,(error,forecastdata) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastdata,
                location,
                address: req.query.address
            })
        })

    })
    
    
        
})


app.get('/products',(req,res) => {
    if (!req.query.search) {
        return res.send({
            error:'you must provide a search term'
        })

    }
    
    console.log(req.query.search)
    res.send({products: []
    })
})


app.get('/help/*',(req,res) => {
    res.render('404',({
        title: '404',
        Author: 'Ajay Rengunthwar',
        errorMessage: 'Help Article not found.!'
    }))
})

// app.get('*',(req,res) => {
//     res.send('My 404 Page')
// })

app.get('*',(req,res) => {
    res.render('404',{
        title: '404',
        Author: 'Ajay Rengunthwar',
        errorMessage: 'Page not found'
    })
})





//app.com
//app.com/help
//app.com/about

app.listen(3000,() => {
    console.log('Server is up on port 3000.')
})