"use client"
import { useEffect, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import Select from '@mui/material/Select';
import { Autocomplete, Card, CardContent, FormControl, InputLabel, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import NavBar from './components/NavBar';

const maxItems = 8;
export default function Home() {

  const [regions, setRegions] = useState('')
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([]);

  const handleRegion = (e) => {
    const SelectedRegion = e.target.value;
    setRegions(SelectedRegion);
    if (SelectedRegion) {
      setFilteredCountries(countries.filter((country) => country.region === SelectedRegion));
    } else {
      setFilteredCountries(countries);
    }
  }

  const handleSearchInput = (event, value) => {
    if (value) {
      setSearch(value);
      setFilteredCountries(countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredCountries(countries);
    }
  };

  useEffect(() => {

    axios.get('https://restcountries.com/v3.1/all')
      .then(res => {
        setCountries(res.data)
        setFilteredCountries(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <NavBar />
      <main>
        <div style={{ height: 'auto' }} className='darkLightBackground container'>
          <div className='containerSearch'>
            <Autocomplete
              autoComplete
              value={search}
              clearOnBlur={false}
              onInputChange={handleSearchInput}
              className='darkLightCardNav searchBar'
              options={countries.map((option) => option.name.common)}
              renderInput={(params) => (
                <TextField {...params} InputProps={{
                  className: 'darkLightText',
                  startAdornment: (
                    <InputAdornment sx={{paddingLeft:'4px'}} position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}  label="Cherche un pays..." variant="outlined" />
 )} />
            <FormControl className='filter'>
              <InputLabel className='darkLightText' id="demo-simple-select-label">Filtrer par région</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                label='Région'
                value={regions}
                onChange={handleRegion}
              >
                <MenuItem value='Europe'>Europe</MenuItem>
                <MenuItem value='Africa'>Africa</MenuItem>
                <MenuItem value='Americas'>Americas</MenuItem>
                <MenuItem value='Oceania'>Oceania</MenuItem>
                <MenuItem value='Asia'>Asia</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className='containerCard'>
          {filteredCountries.length === 0 ? (
  <p>No result found</p>
) : (
          filteredCountries.slice(0, maxItems).map((country, index) => {
              return (
                <Link key={index} href={`/${country.name.common}`}>
                  <Card key={index} className='darkLightCard Card'>
                    <div className='containerImage'><Image style={{objectFit:'fill'}} fill src={country.flags.png} alt={country.name.common} /></div>
                    <CardContent className='darkLightCardNav'>
                      <h2>{country.name.common}</h2>
                      <p><span className='infoSpan'>Population:</span> {country.population.toString().replace(/[^0-9]/g, 's').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                      <p><span className='infoSpan'>Région:</span> {country.region}</p>
                      <p><span className='infoSpan'>Capitale:</span> {country.capital}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            }
            )
)}
          </div>
        </div>
      </main>
    </>
  )
}
