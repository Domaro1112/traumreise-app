'use client';

import { useActionState, useState } from 'react';
import { subscribeToNewsletter } from '@/actions/newsletter';

const initialState = { success: false, error: null };

export function useNewsletter() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);
  const [email, setEmail] = useState('');

  const reset = () => setEmail('');

  return { state, formAction, isPending, email, setEmail, reset };
}
