import React from 'react'
import { Hero, Navbar, LoginPage, SignUpPage, CreateJobPage,
   Feedback, CTA, Companies, LoggedInAsFreelancer, FreelancerNavbar, CreateJobsNavbar } from './components'
import Footer from './components/Footer'
import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

const HomePage = () => (
  <>
    <Navbar />
    <Hero />
    <Companies />
    <Feedback />
    <CTA />
    <Footer />
  </>
);


const FreelancerPage = () =>(
  <>
  <FreelancerNavbar />
  <LoggedInAsFreelancer />
  <Footer />
</>
);


const ClientPageJobCreate = () =>(
  <>
  <CreateJobsNavbar />
  <CreateJobPage />
  <Footer />
</>
);

const App = () => {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/FreelancerPage" element={<FreelancerPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path="/createjob" element={<ClientPageJobCreate/>}/>
          </Routes>
    </Router>
  )
}

export default App
