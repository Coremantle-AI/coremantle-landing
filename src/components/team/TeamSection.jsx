import SectionIntro from '@/components/sections/SectionIntro';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { mailto } from '@/config/site';
import { TEAM, TEAM_GROUPS, teamPhoto } from '@/data/team';

/**
 * "The team" band shared by Home and About: origin story beside the founder
 * portraits, the founding team spanning below. Each portrait opens the
 * profile dialog (components/dialogs/TeamDialog).
 */
export default function TeamSection({ surface = false }) {
  return (
    <Section id="team" surface={surface} className="section--team">
      <Wrap>
        <SectionIntro
          eyebrow="The team"
          title={
            <>
              They built the language layer that others <em>overlooked.</em>
            </>
          }
          lede="Now they are building the data layer for the next billion AI users"
        />
        <div className="team-layout">
          <div className="story" data-reveal="">
            <p>
              The team behind Coremantle also built Reverie Languages Technologies, pioneering language technology for indian
              languages.
            </p>
            <p>
              At Reverie, they saw the problem firsthand: <strong>poor data meant higher errors, wasted compute, weaker models.</strong>
            </p>
            <p>
              After Reverie&rsquo;s acquisition, they came back to solve it at the source.{' '}
              <strong>Coremantle is that missing layer.</strong>
            </p>
            <Button href={mailto('Coremantle sample data')} variant="primary" contactForm>
              Request sample data
            </Button>
          </div>
          {TEAM_GROUPS.map(group => (
            <div className={`team-group team-group--${group.id}`} key={group.id}>
              <p className="team-label" data-reveal="">
                {group.label}
              </p>
              <div className="team-grid">
                {TEAM.filter(member => member.group === group.id).map(member => (
                  <TeamMember member={member} key={member.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}

function TeamMember({ member }) {
  return (
    <button className="tmember" type="button" data-team={member.id} aria-label={`Read ${member.name}’s profile`} data-reveal="">
      <span className="tmember-ring">
        <img
          src={teamPhoto(member.id)}
          alt={`Portrait of ${member.name}`}
          width="320"
          height="320"
          loading="lazy"
          style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
        />
      </span>
      <b>{member.name}</b>
    </button>
  );
}
