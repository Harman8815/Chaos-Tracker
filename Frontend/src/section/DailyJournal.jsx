import React from 'react'
import Footer from '../components/Footer'
import DailyJournalDisplay from '../components/DailyJournalDisplay'
import DailyJournalForm from '../components/DailyJournalForm'

const DailyJournal = () => {
  return (<>
  
    <div className='bg-primary-dark min-h-full overflow-hidden py-6  mb-0 pb-0'>
        <h1 className='text-6xl text-center text-secondary font-bold'>Daily Journal</h1>
        <DailyJournalForm />
        <DailyJournalDisplay />
        <Footer />
        
    </div>
  
  </>
  )
}

export default DailyJournal
