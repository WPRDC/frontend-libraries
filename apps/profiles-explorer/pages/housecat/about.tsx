import Link from 'next/link';
import Layout from '../../components/Layout';
import styles from '../../styles/housecat/About.module.css';
import { HousecatNavbar } from '../../components/Navbar';

function HousecatAbout() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <h3>On this page:</h3>
        <ul>
          <li>
            <a href="#about-the-data">About the data</a>
          </li>
          <li>
            <a href="#tracking-threats-to-affordability">
              Tracking threats to affordability
            </a>
          </li>
          <li>
            <a href="#from-data-to-action">From data to action</a>
          </li>
          <li>
            <a href="#sources">Sources</a>
          </li>
        </ul>
      </div>
      <div className={styles.content}>
        <h2>About</h2>
        <section id="about-the-data">
          <h3>About the Data</h3>
          <p>
            Data in this tool describing subsidized properties has been
            assembled from data shared by HUD and the Pennsylvania Housing
            Finance Agency. It includes data about subsidized properties from
            three major federal housing finance programs:
          </p>
          <ul>
            <li>
              HUD&rsquo;s Multifamily Program supports the development and
              preservation of affordable housing units through direct subsidies,
              guaranteed loans and subsidized mortgages. Data we capture
              includes contracts for direct subsidy programs such as Section 8,
              202, and 811. We also capture data from HUD&rsquo;s
              insured/guaranteed mortgage programs, including 207, 213, 220,
              221(d)(4), 223(f), 223(a)(7), 231, 231, 234(d), 241(a), 542(b),
              542(c). More detailed information for each Multifamily Program is{' '}
              <a href="https://www.google.com/url?q=https://www.hud.gov/program_offices/housing/mfh/progdesc&amp;sa=D&amp;source=editors&amp;ust=1649794639877094&amp;usg=AOvVaw1KrJXRhbkvIuxEHf8p_1e3">
                available from HUD
              </a>
            </li>
            <li>
              The Low Income Housing Tax Credit (LIHTC) program is the most
              important resource for creating affordable housing in the United
              States today. The LIHTC program gives State and local
              LIHTC-allocating agencies (PHFA in Pennsylvania) the equivalent of
              approximately $8 billion in annual budget authority to issue tax
              credits for the acquisition, rehabilitation, or new construction
              of rental housing targeted to lower-income households. We capture
              LIHTC data from both HUD and PHFA.
            </li>
            <li>
              HUD&rsquo;s Public Housing program is managed by local Public
              Housing Agencies, including the Allegheny County Housing
              Authority, Housing Authority of the City of Pittsburgh, and the
              McKeesport Housing Authority. Typically units in this program are
              owned and managed by these agencies.
            </li>
          </ul>
          <p>
            No single table with property information exists across these three
            programs. Each program has their own table and ID system, even if it
            all refers to what many would consider the same project or property.
            Data is not necessarily captured by what most people consider to be
            properties or projects. Data can describe buildings, contracts,
            subsidized loans, or mortgages associated with a property or
            development, or developments themselves. To add to the complexity,
            some projects can also receive a mix of funding from one or more of
            these programs. For example, a project may have one or more
            subsidies from the HUD multifamily program, and/or support from
            LIHTC.
          </p>
          <p>
            To create a linkage across these different programs, we created a
            master &ldquo;property&rdquo; index enabling us to allocate data
            from these three programs to what many would consider a project.
            While some projects have units scattered across multiple sites, we
            currently represent each using only one address.
          </p>
          <p>
            HUD publishes their data online, but there is no consistency in
            their approach. The data is shared in different locations, using
            different file formats ranging from Excel, MS Access, and
            CSV&rsquo;s. Some of the same data is even published in multiple
            locations. We initially tried to merge data from these different
            sources into one dataset, but found a few discrepancies between
            sources. For this reason, we made the decision to present the data
            as it is made available, leaving the user to identify and interpret
            potential discrepancy between sources.
          </p>
        </section>

        <section id="tracking-threats-to-affordability">
          <h3>Tracking Threats to Affordability</h3>
          <p>
            Members of the Preservation Working Group have helped design filters
            that can be used to identify properties that may be at risk of
            losing their subsidies. The filters included in this tool allow
            users to:
          </p>
          <ul>
            <li>
              Identify HUD Multifamily properties whose contracts may soon
              expire, or whose guaranteed loans will reach maturity. These
              expirations are typically measured by dates in each of the
              datasets.
            </li>
            <li>
              Explore LIHTC properties nearing the end of their initial 15 year
              compliance period, and those in their subsequent 15-year extended
              use period. While LIHTC is designed to provide subsidized housing
              for a thirty year term,{' '}
              <a href="https://www.google.com/url?q=https://www.huduser.gov/portal/pdredge/pdr_edge_research_081712.html&amp;sa=D&amp;source=editors&amp;ust=1649794639879200&amp;usg=AOvVaw0OWjuOQpR3Bm63V47nnSE_">
                It&rsquo;s possible for properties to exit the program during
                the extended use period (between years 15-30) through a relief
                process
              </a>
              . Data on LIHTC expirations are measured from the date the
              property was initially placed into service.
            </li>
            <li>
              Keep an eye on HUD multifamily and public housing properties
              receiving low inspection scores using the{' '}
              <a href="https://www.google.com/url?q=https://www.hud.gov/topics/REAC_Inspections&amp;sa=D&amp;source=editors&amp;ust=1649794639879702&amp;usg=AOvVaw1YnKcEL1zw4qJeftyx07uz">
                Real Estate Assessment Center&rsquo;s
              </a>{' '}
              &nbsp;inspection standard.{' '}
              <a href="https://www.google.com/url?q=https://www.hud.gov/sites/dfiles/PIH/documents/inspectionfrequencypassmf_ph.pdf&amp;sa=D&amp;source=editors&amp;ust=1649794639880044&amp;usg=AOvVaw3OiYNljq9CEu_HsL4bigHk">
                Properties are inspected roughly once every one to three years,
                with properties scoring lower inspected more-frequently
              </a>{' '}
              . Properties whose inspection score falls below 60 are classified
              as &ldquo;troubled&rdquo; and are at risk of losing their subsidy.{' '}
              <a href="https://www.google.com/url?q=https://www.wesa.fm/politics-government/2021-11-10/forced-out-study-examines-impact-of-displacement-on-former-bethesda-homewood-tenants&amp;sa=D&amp;source=editors&amp;ust=1649794639880405&amp;usg=AOvVaw0j70WJoO2s-Pr9rPmfPBmr">
                Approximately 100 families in Homewood recently were displaced
              </a>{' '}
              due to a loss of subsidy triggered by poor inspections. To provide
              as much of an early warning as possible, we have attempted to
              provide inspection updates within 24 hours of new data being
              published.
            </li>
            <li>
              The LIHTC program also requires inspections, but this compliance
              process managed by state agencies and the IRS. This process is not
              the same as the one managed by HUD for Multifamily, Public
              Housing, and Housing Choice Voucher programs. Data from the LIHTC
              compliance process is reported in{' '}
              <a href="https://www.google.com/url?q=https://www.irs.gov/pub/irs-access/f8823_accessible.pdf&amp;sa=D&amp;source=editors&amp;ust=1649794639880990&amp;usg=AOvVaw0j0B15Y2eR00Z38p5Jac8D">
                IRS Form 8823
              </a>
              , and is not made publicly-available.
            </li>
          </ul>
        </section>

        <section id="from-data-to-action">
          <h3>From Data to Action</h3>
          <p>tbd</p>
        </section>

        <section id="sources">
          <h3>Sources</h3>
          <p>tbd</p>
        </section>
      </div>
    </div>
  );
}

HousecatAbout.getLayout = function getLayout(page: React.ReactChildren) {
  return <Layout Navbar={HousecatNavbar}>{page}</Layout>;
};

export default HousecatAbout;
