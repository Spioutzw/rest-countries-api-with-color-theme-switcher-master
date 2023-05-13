"use client"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import style from './../styles/country.module.css'
import Image from 'next/image'
import NavBar from '../components/NavBar'
import axios from 'axios'

async function getBorderCountries(countryName) {
    // Récupérer les informations sur le pays
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`)
    const country = response.data[0]

    // Récupérer les codes de pays frontaliers

    //verifier si le pays a des frontières
    if (!country.borders) {
        return []
    }

    const borderCodes = country.borders

    // Récupérer les informations sur chaque pays frontalier
    const borderCountries = await Promise.all(
        borderCodes.map(async (code) => {
            const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`)
            return response.data[0].name.common
        })
    )

    return borderCountries
}



export default function Country(props) {

    const [country, setCountry] = useState([])
    const [borderCountries, setBorderCountries] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`https://restcountries.com/v3.1/name/${props.params.countryName}`)
                setCountry(response.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
        console.log(props.params.countryName, 'props.params.countryName')
        getBorderCountries(props.params.countryName).then((borderCountries) => {
            setBorderCountries(borderCountries)
        })
    }, [])

    if (!country[0]) {
        return <h1>Loading...</h1>
    }


    return (
        <>
            <NavBar />
            <main>
                <div className={`${style.container} darkLightBackground`}>
                    <Link className={`${style.buttonBack} darkLightText `} href='/'> <ArrowBackIcon/> back </Link>
                    <div className={style.containerCard}>
                        <div className={style.containerImage}><Image fill className={style.IMG} src={country[0].flags.png} alt={country[0].name.common} /></div>
                        <div className={style.containerContent}>
                            <div>
                                <div>
                                    <h2> {country[0].name.common} </h2>
                                </div>
                                <div className={style.containerInfo}>
                                    <p className={style.nativeName}><span>Native Names :</span>
                                        {Object.entries(country[0].name.nativeName).map(([key, value], index, array) => (
                                            <> {`${' '}${value.official}${index === array.length - 1 ? '' : ','}`} </>
                                        ))}
                                    </p>
                                    <p> <span>Population :</span> {country[0].population} habitant </p>
                                    <p> <span>Region :</span> {country[0].region}</p>
                                    <p> <span>Subregion :</span> {country[0].subregion} </p>
                                    <p> <span>Capital :</span> {country[0].capital}</p>
                                    <p> <span>Top Level Domain :</span> {country[0].tld[0]} </p>
                                    <p> <span>Currencies :</span>

                                        {Object.entries(country[0].currencies).map(([key, value]) => (
                                            <>{`${' '}${value.name}`}</>
                                        ))}
                                    </p>
                                    <p className={style.nativeName}><span>Languages :</span>

                                        {Object.values(country[0].languages).map((value, index, array) => (
                                            `${' '}${value}${index === array.length - 1 ? '' : ','}`
                                        ))}
                                    </p>
                                </div>
                            </div>
                            <div className={style.containerFrontCountry}>
                                <p><span>Pays Frontalier:</span></p>
                                <div className={`${style.containerLink}`}>
                                    {borderCountries.map((countryName) => (
                                        <Link className={`${style.countryFront} darkLightCardNav darkLightText `} key={countryName} href={`/${countryName}`}>{countryName}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
