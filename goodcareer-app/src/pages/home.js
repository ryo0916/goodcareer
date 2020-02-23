import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import Company from '../components/Company';

class home extends Component {
  state = {
    companies: null
  }
  componentDidMount(){
    axios.get('/companies')
      .then((res) => {
        this.setState({
          companies: res.data
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    let recentCompaniesMarkup = this.state.companies ? (
    this.state.companies.map((company) => <Company key={company.companyId} company={company} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {recentCompaniesMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile....</p>
        </Grid>
      </Grid>
    )
  }
}

export default home
