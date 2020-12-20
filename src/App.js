import './App.css';
import React, { useEffect } from 'react';

function Header() {
  return (
    <header>
      <h1>All Countries data</h1>
    </header>
  )
}

function SearchBox({text, setText, page, setPage}) {
  return (
    <input type="search" value={text} className="form-control input-lg mb-3" onChange={(event)=>setText(event.target.value)} placeholder="Search here...." onKeyPress={(event)=>(page>1)?setPage(1):null}/>
  )
}

function Pagination({page_number, totalPages, setPageNumber}){
  let pages=[]
  if(totalPages<=5){
    for(let page=1; page<=totalPages; page++){
      pages.push(<li key={page} className={(page===page_number)?"page-item active":"page-item"}><button className="page-link" onClick={()=>setPageNumber(page)}>{page}</button></li>)
    }
  }
  else{
    let checking = page_number;
    if(Math.abs(totalPages-page_number)<5)
      checking=totalPages-5;
    if(page_number>=2){
      pages.push(<li key={"first"} className="page-item"><button className="page-link" onClick={()=>setPageNumber(1)}>{"First"}</button></li>)
      pages.push(<li key={"prev"} className="page-item"><button className="page-link" onClick={()=>setPageNumber(page_number-1)}>Prev</button></li>)
    }
    for(let page=checking; (page<page_number+5 && page<=totalPages); page++){
      pages.push(<li key={page} className={(page===page_number)?"page-item active":"page-item"}><button className="page-link" onClick={()=>setPageNumber(page)}>{page}</button></li>)
    }
    if(page_number<=totalPages-1){
      pages.push(<li  key={"next"} className="page-item"><button className="page-link" onClick={()=>setPageNumber(page_number+1)}>Next</button></li>)
    pages.push(<li key={"last"} className="page-item"><button className="page-link" onClick={()=>setPageNumber(totalPages)}> {">>"+totalPages}</button></li>)
    }
  }
  return (
    <nav>
    <ul className="pagination pagination-lg justify-content-center">
      {
        pages.map((item)=>(
          item
        ))
      }
    </ul>
    </nav>
  )
}

function Countries({countries}) {
  return (
    <div className="row mb-3">
      {
        countries.map((item, index)=>{
          return (
          <div className="col-lg-4 col-sm-12 mb-3" key={index}>
          <div className="card card-sty">
            <div className="card-header head">
              {item['name']}
            </div>
            <div className="card-body content">
              <img width="100%" height="200 rem" src={item['flag']} alt="National Flag" style={{marginBottom: "10px"}}/>
              <p>Capital: {item['capital']}</p>
              <p>Region: {item['region']}</p>
              <p>Latitude: {item['latlng'][0]}</p>
              <p>Longitude: {item['latlng'][1]}</p>
              <p>Country Code: {item['alpha3Code']}</p>
            </div>
          </div>
        </div>
        )
        })
      }
    </div>
  )
}

function executeSearch(list, text){
  if(text === "") return list;
  return list.filter((item)=>(
    item.name.toLowerCase().includes(text.toLowerCase()) || item.capital.toLowerCase().includes(text.toLowerCase()) || item.region.toLowerCase().includes(text.toLowerCase())
  ))
}

function App() {
  const [search_text, setSearchText] = React.useState("");
  const [countries_list, setCountries] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const totalCoutriesPerPage = 3;
  const filter_countries = executeSearch(countries_list, search_text, pageNumber, setPageNumber);
  const last_index = pageNumber*totalCoutriesPerPage;
  const start_index = last_index - totalCoutriesPerPage;
  const countries = filter_countries.slice(start_index, last_index);
  const totalPages = Math.ceil(filter_countries.length/totalCoutriesPerPage);
  useEffect(()=>{
    async function load_data(){
      let response = await fetch("https://restcountries.eu/rest/v2/all");
      if(response.status === 200){
        var data = await response.json();
        setCountries(data);
      }
    }
    load_data();
  },[])
  return (
    <div className="container">
      <Header/>
      <SearchBox text={search_text} setText={setSearchText} page={pageNumber} setPage={setPageNumber}/>
      <Countries countries={countries}/>
      {
        (totalPages>1)?(
          <Pagination page_number={pageNumber} totalPages={totalPages} setPageNumber={setPageNumber}/>
        ):(
          null
        )
      }
    </div>
  );
}

export default App;


// onKeyPress={(event)=>{(event.key === "Enter")?probas.addTodo():null}}