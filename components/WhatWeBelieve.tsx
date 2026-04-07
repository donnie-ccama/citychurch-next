'use client';

import { useState } from 'react';

type BeliefItem = {
  title: string;
  type: 'paragraphs' | 'bullets';
  body: string[];
};

const beliefs: BeliefItem[] = [
  {
    title: 'God loves you.',
    type: 'paragraphs',
    body: [
      "That phrase might be very familiar and comforting to you. Or perhaps, you've never considered what those words really mean.",
      "From the beginning, God intended to show everyone that He is a good Father who could be trusted with every aspect of life—our relationships, careers, even our insecurities. But the Bible teaches that the first humans mistrusted God's design and went their own way.",
      "We have all made this same deadly choice. God has given us direction for our good, yet we have all rejected Him in our own ways. Making even small decisions that separate us from God is called sin. We all do it, and we'll continue to do so. Sin only leads to brokenness in life and relationships. Even our best attempts to escape brokenness only lead to more pain.",
      "But God loves us so much that He was willing to enter our brokenness with us.",
      "The Bible teaches that God sent His only son, Jesus, to die so the rest of us could live. Although Jesus did nothing wrong, He died on a cross and paid the debt for our rebellion. And His resurrection from death changed everything.",
      "Because of what Jesus did on our behalf, we have the opportunity to trust God and turn away from our ways of doing life on our own. God is willing to forgive anyone that trusts Him, and He restores our relationship with Him and others.",
    ],
  },
  {
    title: 'We believe in one God—Father, Son, and Holy Spirit.',
    type: 'bullets',
    body: [
      'We believe in God the Father, creator of the universe.',
      'We believe in God the Son, Jesus Christ, the eternal Word, the one and only Savior; Who was conceived by the Holy Spirit and born of the virgin Mary, both fully human and fully divine; Who lived a sinless life; Who suffered and was crucified as an atonement for sin; Who rose again bodily from the dead on the third day; Who ascended into Heaven; and Who will return in victory to rule forever.',
      'We believe in the Holy Spirit: who convicts of sin; Who indwells every Christian; Who helps us in our weakness and intercedes for us in prayer; and Who empowers us to a victorious Christian life.',
    ],
  },
  {
    title: 'We believe in Good News—the cross of Jesus changes everything.',
    type: 'bullets',
    body: [
      'That man, created by God, willfully sinned against God and is consequently lost and without hope apart from Jesus Christ.',
      'That salvation—the forgiveness of sins—is only by grace through the blood of Jesus Christ.',
      'That one receives salvation by putting faith in Christ, repenting of sin, and confessing Christ, and that the Bible commands every believer in Christ to be baptized.',
      'That those who have received salvation through faith in Jesus Christ are sent into the world to proclaim the Gospel and to love and serve the world just as Jesus Himself did.',
    ],
  },
  {
    title: "We believe in the Bible—God's perfect Word.",
    type: 'bullets',
    body: [
      'We believe God inspired the original writings of the Scripture and those original writings were consequently without error.',
      'We believe that the Bible is the final authority for all matters of faith, truth, morality, and Christian living.',
      "We believe the Bible teaches that God is the Creator and Sustainer of human life; that God creates each person in His image; and that life is therefore sacred, from conception to natural death. We believe that God creates each person as male or female; that these two distinct, complementary genders together reflect the \"image of God\" in humankind; and that each person's biological gender is an intrinsic, immutable aspect of his or her nature and identity.",
      'We believe the Bible teaches that God established marriage in the beginning as a lifelong, exclusive relationship between one man and one woman.',
    ],
  },
  {
    title: "We believe in the church—God's people on mission.",
    type: 'bullets',
    body: [
      'We believe in the Church of Jesus Christ, founded on the Day of Pentecost, consisting of all Christians everywhere, and organized into local assemblies, called churches.',
      'We believe the Bible teaches that every Christian should be an active member of a local church.',
      "We believe the Bible instructs church members to: meet together regularly for fellowship, worship, teaching, and the Lord's Supper; use our natural abilities and spiritual gifts to serve one another; love one another, bear with one another, accept one another, and forgive one another; seek unity, agreement, and peace with one another; bear one another's burdens and pray for one another; spur one another to love and good deeds; submit to the authority of the elders of the church; support the church financially; pursue personal holiness and obedience to God's Word; and strive together to fulfill the Great Commission.",
    ],
  },
];

export default function WhatWeBelieve() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {beliefs.map((belief, idx) => {
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
                {belief.title}
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
                maxHeight: isOpen ? '2000px' : '0',
                transition: 'max-height 0.4s ease, opacity 0.25s ease',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div style={{ padding: '0 0 1.25rem 3rem' }}>
                {belief.type === 'paragraphs' ? (
                  belief.body.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9375rem',
                        lineHeight: 1.7,
                        margin: 0,
                        marginBottom: pIdx < belief.body.length - 1 ? '0.75rem' : 0,
                      }}
                    >
                      {para}
                    </p>
                  ))
                ) : (
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                    }}
                  >
                    {belief.body.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        style={{
                          display: 'flex',
                          gap: '0.625rem',
                          color: 'var(--text-secondary)',
                          fontSize: '0.9375rem',
                          lineHeight: 1.7,
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--accent)',
                            flexShrink: 0,
                            marginTop: '0.1rem',
                          }}
                        >
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
