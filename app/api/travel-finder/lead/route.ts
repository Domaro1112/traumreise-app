import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/repositories/travel-funnel';
import { isValidEmail } from '@/lib/utils';

const CONSENT_TEXT =
  'Ich möchte den kostenlosen Reisezeit- und Preiswecker für meine ausgewählten Traumziele erhalten ' +
  'und akzeptiere die Datenschutzhinweise von Reisemonkey.de.';

export async function POST(request: NextRequest) {
  try {
    const {
      email, consent,
      sessionId, moods, season, budget, duration, destinations, personalNote,
    } = (await request.json()) as {
      email:          string;
      consent:        boolean;
      sessionId?:     string;
      moods?:         string[];
      season?:        string;
      budget?:        string;
      duration?:      string;
      destinations?:  unknown[];
      personalNote?:  string;
    };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Bitte gib eine gültige E-Mail-Adresse ein.' },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'Bitte akzeptiere die Datenschutzhinweise.' },
        { status: 400 }
      );
    }

    const lead = await createLead({
      email,
      consent: true,
      consentText:          CONSENT_TEXT,
      sessionId:            sessionId    ?? null,
      selectedDestinations: destinations ?? [],
      moodSelection:        Array.isArray(moods) ? moods : [],
      season:               season       ?? null,
      budget:               budget       ?? null,
      duration:             duration     ?? null,
      personalNote:         personalNote ?? null,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error('[travel-finder/lead]', err);
    return NextResponse.json(
      { error: 'Anmeldung konnte nicht gespeichert werden. Bitte versuche es erneut.' },
      { status: 500 }
    );
  }
}
