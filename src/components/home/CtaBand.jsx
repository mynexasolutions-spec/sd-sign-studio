import { Link } from 'react-router-dom'

export default function CtaBand() {
  return (
    <div className="cta-band" id="contact">
      <div className="cta-band-inner">
        <div className="cta-left">
          <h2>Ready To Transform<br/><span className="red">Your Brand?</span></h2>
          <p>Get a free consultation and quote for your next project. We're here to help your business stand out.</p>
          <Link to="/quote" className="btn-red">Get a Free Quote</Link>
        </div>
      </div>
    </div>
  )
}
