'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { LinkedInIcon } from '@/components/ui/icons';
import { findMember, teamPhoto } from '@/data/team';
import { isBackdropClick, onDelegatedClick } from '@/lib/utils/dialog';

const OPEN_CLASS = 'team-dialog-open';

/**
 * Team profile modal. Opened by any `[data-team="<id>"]` trigger (the
 * portrait buttons in TeamGrid); content comes from data/team.js.
 */
export default function TeamDialog() {
  const dialogRef = useRef(null);
  const innerRef = useRef(null);
  const triggerRef = useRef(null);
  const [member, setMember] = useState(null);

  useEffect(
    () =>
      onDelegatedClick('[data-team]', trigger => {
        const next = findMember(trigger.getAttribute('data-team'));
        if (!next) return;
        triggerRef.current = trigger;
        // commit the profile before the dialog becomes visible
        flushSync(() => setMember(next));
        const dialog = dialogRef.current;
        if (!dialog.open) dialog.showModal();
        // focus the panel, not the close button, so the profile reads from
        // the top and no focus ring lands on the X after a pointer click
        innerRef.current.focus();
        document.documentElement.classList.add(OPEN_CLASS);
      }),
    [],
  );

  useEffect(() => () => document.documentElement.classList.remove(OPEN_CLASS), []);

  const close = () => dialogRef.current?.close();

  const onClose = () => {
    document.documentElement.classList.remove(OPEN_CLASS);
    if (triggerRef.current?.isConnected) triggerRef.current.focus();
  };

  const onCancel = event => {
    event.preventDefault();
    close();
  };

  const onClick = event => {
    if (event.target.closest('[data-team-close]') || isBackdropClick(dialogRef.current, event)) close();
  };

  return (
    <dialog ref={dialogRef} className="team-dialog" aria-labelledby="team-dialog-name" onClick={onClick} onClose={onClose} onCancel={onCancel}>
      <div className="team-dialog__inner" tabIndex={-1} ref={innerRef}>
        <button className="team-dialog__close" type="button" data-team-close aria-label="Close profile" />
        <div className="team-dialog__id">
          <img
            className="team-dialog__photo"
            src={member ? teamPhoto(member.id) : undefined}
            alt={member ? `Portrait of ${member.name}` : ''}
            width="320"
            height="320"
            style={member?.objectPosition ? { objectPosition: member.objectPosition } : undefined}
          />
          <h2 className="team-dialog__name" id="team-dialog-name">
            {member?.name}
          </h2>
          <p className="team-dialog__role">{member?.role}</p>
          <a
            className="button button--primary team-dialog__li"
            href={member?.linkedin ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={member ? `${member.name} on LinkedIn` : undefined}
          >
            <LinkedInIcon className="team-dialog__li-mark" />
            <span>LinkedIn</span>
          </a>
        </div>
        <div className="team-dialog__bio">
          {member?.bio.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </dialog>
  );
}
