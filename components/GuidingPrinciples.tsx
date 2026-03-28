'use client';

import { useState } from 'react';

const principles = [
  {
    title: "We don\u2019t vote on the Great Commission.",
    body: "The Great Commission is not up for debate. Jesus has given us the authority to make, mark, mold, and mend disciples.",
  },
  {
    title: "Every child deserves to hear about Jesus.",
    body: "We will not let a child\u2019s finances, location, race, culture, country, or age stop us from sharing Christ with them.",
  },
  {
    title: "We go to the worst first.",
    body: "We start with the hardest places. We do not avoid the most disadvantaged or dangerous parts of our city. We go there first because children in those areas often have no chance to hear the gospel.",
  },
  {
    title: "We go where faith can be found.",
    body: "We are called to be faithful witnesses, and it is up to God to add to the church those who will be saved. Just as a farmer would not sow seed in a rocky bar-ditch or on hard bedrock, we go where faith is to be found. We believe that a great harvest is to be gathered at this time among children. That is the reason we spend our greater resources and time sowing in this spiritually fertile ground.",
  },
  {
    title: "Helping without hope is no help at all.",
    body: "We use our resources to meet children\u2019s and families\u2019 needs, but our main goal is to lead people to Jesus. Without the hope He gives, any help we offer is only temporary.",
  },
  {
    title: "People who need rescue are rarely in a flattering condition.",
    body: "We must love them as they are to help them move forward. This often means facing tough challenges.",
  },
  {
    title: "We do what we do and don\u2019t do what we don\u2019t do.",
    body: "We focus on our calling. We are not just another agency handing out help. We respond when we see a need and use most of our resources for children. Kids can\u2019t choose where they live or how to care for themselves, so we serve those who are truly helpless.",
  },
  {
    title: "If you do the work, you get to be the leader.",
    body: "Our role is to support the people God brings to serve with us. We trust our workers to make decisions in their areas of service.",
  },
  {
    title: "We prefer doing the right thing rather than doing things the right way.",
    body: "We focus on action, not just discussion or study. Some criticize us for skipping forums and seminars on homelessness and poverty, but our ministry continues.",
  },
  {
    title: "The mission comes first.",
    body: "Our work with inner-city children and families is more important than our own preferences. Even when we help one person, we do not lose sight of the bigger mission.",
  },
  {
    title: "Often, evangelism is not pretty.",
    body: "Evangelism is often messy. It is not always easy or convenient. Sometimes it means hard work, like fixing a van in the snow or working in the heat. If it were easy, everyone would do it.",
  },
  {
    title: "Remember, it will all wash off, or we will find something to kill it.",
    body: "Any dirt or mess can be cleaned up, or we can find a way to deal with it.",
  },
];

export default function GuidingPrinciples() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {principles.map((principle, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            style={{
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <button
              onClick={() => toggle(idx)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text-primary)',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: 'var(--accent)',
                  minWidth: '2rem',
                  flexShrink: 0,
                }}
              >
                {idx + 1}.
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '1.0625rem',
                  letterSpacing: '-0.01em',
                  flex: 1,
                }}
              >
                {principle.title}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  flexShrink: 0,
                  color: 'var(--text-muted)',
                  transition: 'transform 0.25s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              style={{
                overflow: 'hidden',
                maxHeight: isOpen ? '300px' : '0',
                transition: 'max-height 0.3s ease, opacity 0.25s ease',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p
                style={{
                  padding: '0 0 1.25rem 3rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {principle.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
