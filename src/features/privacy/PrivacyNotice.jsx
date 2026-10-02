// Privacy Notice body. Each clause is a numbered LegalSection; the copy is
// the legal text verbatim - change it only with sign-off.

function LegalSection({ n, title, children }) {
  return (
    <section>
      <h2>
        <span className="n">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function PrivacyNotice() {
  return (
    <div className="legal-body">
      <LegalSection n="01" title="Purpose">
        <p>
          Coremantle AI Private Limited (“Coremantle,” “we,” “us,” or “our”) provides AI data annotation, dataset creation, and Indian-language data services. We are committed to protecting the privacy and personal data of our customers, employees, job applicants, contributors, business partners, website visitors, and other stakeholders. This Privacy Notice explains how we collect, use, store, disclose, and protect personal data, in accordance with the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025 (“DPDPA”) as our primary applicable law, and the EU General Data Protection Regulation (“GDPR”) where relevant to our international stakeholders.
        </p>
        <p>
          Where Coremantle processes personal data on behalf of a client under a signed Data Processing Agreement — for example, annotation datasets a client supplies to us — Coremantle acts as a Data Processor, and that engagement is governed by the client’s own instructions and privacy notice, not this document.
        </p>
      </LegalSection>
      <LegalSection n="02" title="Scope">
        <p>This Privacy Notice applies to:</p>
        <ul>
          <li>Customers and prospective customers</li>
          <li>Employees and former employees</li>
          <li>Job applicants</li>
          <li>Contributors, consultants, and contractors</li>
          <li>Business partners and vendors</li>
          <li>Website visitors</li>
          <li>Event participants</li>
          <li>Individuals who otherwise communicate with Coremantle</li>
        </ul>
      </LegalSection>
      <LegalSection n="03" title="Information We Collect">
        <h3>3.1 Customer Information</h3>
        <ul>
          <li>Name, company name, job title, business address, email address, phone number</li>
          <li>Payment and billing details</li>
          <li>Government identification, where legally required</li>
          <li>Communication records and contractual information</li>
          <li>Service usage information</li>
        </ul>
        <h3>3.2 Employee Information</h3>
        <ul>
          <li>Personal identification details, employee ID, date of birth, contact information</li>
          <li>Educational qualifications and employment history</li>
          <li>Background verification information and government-issued identification</li>
          <li>Bank account, salary, payroll, and tax information</li>
          <li>Attendance, performance review, and training records</li>
          <li>Emergency contacts and, where required by law, medical information</li>
          <li>System access logs and device/network usage information</li>
        </ul>
        <h3>3.3 Job Applicant Information</h3>
        <ul>
          <li>Resume/CV, employment history, educational qualifications, references</li>
          <li>Interview notes and assessment results</li>
          <li>Background verification information, where consented</li>
        </ul>
        <h3>3.4 Website Visitor Information</h3>
        <ul>
          <li>IP address, browser type, device information, operating system</li>
          <li>Approximate geographic location, pages visited, date/time of visit, referral source</li>
          <li>Cookies, similar technologies, and website usage analytics</li>
        </ul>
        <h3>3.5 Business Partner Information</h3>
        <ul>
          <li>Contact details and company information</li>
          <li>Banking information and tax registration details</li>
          <li>Contract information and communication records</li>
        </ul>
      </LegalSection>
      <LegalSection n="04" title="How We Collect Information">
        <p>
          We collect personal data through direct interactions, website forms, email communications, employment applications, recruitment agencies, business contracts, cookies, analytics tools, security systems, publicly available sources, and third-party service providers.
        </p>
      </LegalSection>
      <LegalSection n="05" title="Purpose of Processing">
        <h3>5.1 Customer Data</h3>
        <ul>
          <li>Manage customer relationships and respond to inquiries</li>
          <li>Process payments and improve services</li>
          <li>Meet legal obligations and prevent fraud</li>
        </ul>
        <h3>5.2 Employee Data</h3>
        <ul>
          <li>Recruitment and employment administration</li>
          <li>Payroll and benefits administration</li>
          <li>Performance management, training, and workforce planning</li>
          <li>Regulatory compliance, information security, and business continuity</li>
        </ul>
        <h3>5.3 Website Visitors</h3>
        <ul>
          <li>Operate and secure the website; improve user experience</li>
          <li>Analyze website performance and respond to requests</li>
          <li>Marketing communications, only where consent has been provided</li>
        </ul>
        <p>
          We do not use personal data to make any solely automated decision that produces a legal or similarly significant effect on an individual.
        </p>
      </LegalSection>
      <LegalSection n="06" title="Legal Basis for Processing">
        <p>
          Where required by applicable law, we process personal data based on one or more of: individual consent; performance of a contract; compliance with a legal obligation; legitimate business interests, balanced against individual rights; protection of vital interests; or public interest obligations. Under the DPDPA specifically, this generally means your consent for a specified purpose, or a “legitimate use” recognised by the Act, such as an employment relationship or a request you have voluntarily made.
        </p>
      </LegalSection>
      <LegalSection n="07" title="Cookies">
        <p>
          Our website uses cookies and similar technologies to maintain website functionality, remember user preferences, analyze website traffic, improve user experience, support security, and measure marketing effectiveness. You may control cookies through your browser settings; disabling certain cookies may affect website functionality. Where required by applicable law, we present a cookie consent banner and activate non-essential analytics only after consent.
        </p>
      </LegalSection>
      <LegalSection n="08" title="Sharing of Personal Information">
        <p>
          We do not sell personal data. We may share personal data with group companies, professional advisors, auditors, payroll providers, cloud and IT service providers, recruitment partners, banks, government authorities where legally required, regulatory bodies, and law enforcement agencies. We share data only under contract and strictly for the purposes described in this Notice. For security reasons, we do not publish the identities of specific vendors or the precise locations of our infrastructure on this page; this information is available to clients under a signed Data Processing Agreement, and to regulators or auditors on lawful request. If Coremantle is involved in a merger, acquisition, or asset sale, personal data may be transferred as part of that transaction, subject to this Notice or a materially similar one.
        </p>
      </LegalSection>
      <LegalSection n="09" title="International Transfers">
        <p>
          Coremantle primarily stores and processes personal data within India. Where personal data is transferred outside the country of collection — for example, to certain analytics, email, or language-processing providers — we implement appropriate contractual and technical safeguards in accordance with applicable data protection laws. For security reasons, specific data-centre locations and provider names are not published here; this information can be made available under a signed confidentiality or Data Processing Agreement. If you are located in the EEA, we transfer personal data outside the EEA only where an adequate safeguard, such as Standard Contractual Clauses or an adequacy decision, is in place.
        </p>
      </LegalSection>
      <LegalSection n="10" title="Information Security">
        <p>
          Coremantle implements appropriate technical and organizational safeguards, including access controls, encryption, multi-factor authentication, secure network architecture, security monitoring, endpoint protection, vulnerability management, secure software development practices, employee awareness training, physical security controls, and backup and disaster recovery procedures.
        </p>
      </LegalSection>
      <LegalSection n="11" title="Data Retention">
        <p>
          Personal data is retained only for as long as necessary to fulfil business purposes, meet contractual obligations, comply with legal and regulatory requirements, resolve disputes, and enforce agreements. Following the applicable retention period, personal data is securely deleted, anonymized, or destroyed. As a general guide: website enquiry data is retained for up to 24 months from the last interaction unless a contractual relationship begins; job application data is retained for up to 12 months unless applicable law requires otherwise; employee data is retained per statutory and contractual requirements for the duration of employment and any legally mandated period thereafter.
        </p>
      </LegalSection>
      <LegalSection n="12" title="Individual Rights">
        <p>Subject to applicable law, individuals have the following rights as Data Principals under the DPDPA:</p>
        <table className="legal-table">
          <thead><tr><th>Right</th><th>What it means</th></tr></thead>
          <tbody>
            <tr><td>Right to Access</td><td>Confirm whether we process your personal data and obtain a summary of it.</td></tr>
            <tr>
              <td>Right to Correction &amp; Erasure</td>
              <td>Ask us to correct inaccurate or incomplete data, or delete data we no longer have a lawful basis to keep.</td>
            </tr>
            <tr>
              <td>Right to Grievance Redressal</td>
              <td>
                Raise a complaint about how your data is handled and receive a response before escalating to the Data Protection Board of India.
              </td>
            </tr>
            <tr>
              <td>Right to Nominate</td>
              <td>Nominate another individual to exercise your rights on your behalf in the event of death or incapacity.</td>
            </tr>
            <tr>
              <td>Right to Withdraw Consent</td>
              <td>Withdraw consent at any time, as easily as it was given, without affecting processing already carried out.</td>
            </tr>
          </tbody>
        </table>
        <p>
          If the GDPR applies to you, you additionally have the right to data portability, the right to object to processing based on legitimate interests or for direct marketing, and the right to lodge a complaint with your local supervisory authority. Requests may be submitted using the contact information in Section 17.
        </p>
      </LegalSection>
      <LegalSection n="13" title="Employee Monitoring">
        <p>
          Coremantle may monitor the use of company systems, devices, networks, email, and other information assets for information security, regulatory compliance, business continuity, fraud prevention, protection of company assets, and investigation of security incidents. Monitoring is conducted in accordance with applicable law and internal company policy, and employees are notified of monitoring practices separately.
        </p>
      </LegalSection>
      <LegalSection n="14" title="Children’s Privacy">
        <p>
          Our services and website are not intended for individuals under the age of 18. We do not knowingly collect personal data from children without appropriate authorization where required by applicable law. If you believe a child has provided us with personal data, please contact us so we can delete it.
        </p>
      </LegalSection>
      <LegalSection n="15" title="Third-Party Websites">
        <p>
          Our website may contain links to external websites. Coremantle is not responsible for the privacy practices or content of third-party websites, and we encourage you to review their privacy notices before providing personal data.
        </p>
      </LegalSection>
      <LegalSection n="16" title="Data Breach Management">
        <p>
          In the event of a personal data breach, Coremantle will investigate the incident, contain and remediate the issue, assess potential risks, notify affected individuals where required, notify regulators where legally required — including the Data Protection Board of India within the timelines prescribed under the DPDPA, and, where the GDPR applies, within 72 hours of becoming aware of the breach where feasible — and implement corrective actions.
        </p>
      </LegalSection>
      <LegalSection n="17" title="Contact Information">
        <p>For questions regarding this Privacy Notice, or to exercise applicable privacy rights, please contact:</p>
        <ul className="legal-contact">
          <li><strong>Data Protection Officer</strong><a href="mailto:dpo@coremantle.ai">dpo@coremantle.ai</a></li>
          <li>
            <strong>Grievance Officer (data protection matters)</strong>
            <a href="mailto:grievance@coremantle.ai">grievance@coremantle.ai</a>
          </li>
          <li>
            <strong>Registered Office</strong>
            Coremantle AI Private Limited, 3rd Floor, 334, Sector 2, 27th Main, HSR Layout, Bengaluru, 560102
          </li>
        </ul>
      </LegalSection>
      <LegalSection n="18" title="Changes to This Privacy Notice">
        <p>
          This Privacy Notice may be updated periodically to reflect changes in our practices, our services, or applicable law. Material changes will be communicated through appropriate channels, including updates on our website with a revised “Last Reviewed” date.
        </p>
      </LegalSection>
      <LegalSection n="19" title="Consent">
        <p>
          Where required by applicable law, by using our services, submitting information, applying for employment, or accessing our website, individuals acknowledge that they have read and understood this Privacy Notice and consent to the processing of their personal data as described herein.
        </p>
      </LegalSection>

    </div>
  );
}
