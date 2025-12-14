import React, { useState, useId } from 'react'

const IMPORTANT_KEYS = new Set(['name','customer','customer_name','email','customer_email','phone','customer_phone','serviceType','product','position','status'])

const GROUP_DEFINITIONS = [
  {
    label: 'Contact information',
    keys: ['name','customer','customer_name','email','customer_email','phone','customer_phone','subject']
  },
  {
    label: 'Request details',
    keys: ['serviceType','containerSize','quantity','duration','deliveryAddress','address','shipping_address','product','position','experience','message','notes','attachments']
  },
  {
    label: 'Status & timeline',
    keys: ['status','createdAt','created_at','updated_at','source_page','sourcePage']
  }
].map(def => ({ ...def, keySet: new Set(def.keys) }))

function normalizeValue(value) {
  if (value === undefined || value === null || value === '' || value === '—') {
    return 'Not provided'
  }
  return value
}

function buildGroups(fields = []) {
  const groups = GROUP_DEFINITIONS.map(def => ({ label: def.label, items: [] }))
  const other = { label: 'Other submitted info', items: [] }
  fields.forEach(field => {
    const idx = GROUP_DEFINITIONS.findIndex(def => def.keySet.has(field.key))
    if (idx >= 0) groups[idx].items.push(field)
    else other.items.push(field)
  })
  const rendered = groups.filter(group => group.items.length > 0)
  if (other.items.length > 0) rendered.push(other)
  return rendered.length ? rendered : [{ label: 'Submission fields', items: fields }]
}

export function SubmissionMeta({ display }) {
  const meta = display?.meta || {}
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
      <div>
        <div className="font-semibold text-gray-700">Form</div>
        <div className="text-gray-900">{meta.formLabel || 'Submission'}</div>
      </div>
      <div>
        <div className="font-semibold text-gray-700">Submitted</div>
        <div className="text-gray-900">{meta.submittedAt ? new Date(meta.submittedAt).toLocaleString() : '—'}</div>
      </div>
      <div>
        <div className="font-semibold text-gray-700">Source Page</div>
        <div className="text-gray-900 break-words">{meta.source || 'Not captured'}</div>
      </div>
    </div>
  )
}

export function SubmissionFieldList({ display }) {
  if (!display?.fields?.length) {
    return <div className="mt-4 text-gray-500">No submission data available.</div>
  }
  const groups = buildGroups(display.fields)
  return (
    <div className="mt-6 space-y-6">
      {groups.map(group => (
        <div key={group.label}>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{group.label}</h4>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.items.map((field) => {
              const highlight = IMPORTANT_KEYS.has(field.key)
              return (
                <div key={field.key} className={`border rounded-lg p-3 space-y-1 ${highlight ? 'bg-white border-l-4 border-[#e84424]' : 'bg-gray-50 border'}`}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}</dt>
                  <dd className="text-gray-900 whitespace-pre-wrap break-words text-sm">{normalizeValue(field.value)}</dd>
                </div>
              )
            })}
          </dl>
        </div>
      ))}
    </div>
  )
}

export function SubmissionAttachments({ display }) {
  if (!display?.attachments?.length) return null
  return (
    <div className="mt-6">
      <div className="text-sm font-semibold text-gray-700 mb-2">Attachments & Links</div>
      <ul className="space-y-2">
        {display.attachments.map((attachment) => (
          <li key={attachment.key}>
            <a
              href={attachment.url || attachment.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0a2a52] underline"
            >
              {attachment.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SubmissionRawPayload({ payload }) {
  const [open, setOpen] = useState(false)
  const rawId = useId()
  if (!payload || Object.keys(payload).length === 0) return null
  const sectionId = `${rawId}-helper`
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={rawId}
        className="text-sm font-semibold text-[#0a2a52] hover:text-[#e84424]"
      >
        {open ? 'Hide raw payload' : 'Show raw payload'}
      </button>
      <p id={sectionId} className="text-xs text-gray-500 mt-1">Raw payload shows the exact JSON the customer submitted. Review internally only — do not forward sensitive data outside the team.</p>
      {open && (
        <pre id={rawId} className="mt-3 bg-gray-900 text-gray-100 text-xs rounded p-3 max-h-64 overflow-auto" aria-describedby={sectionId}>
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </div>
  )
}

const HUMANIZE_CACHE = {}
function humanizeKey(key) {
  if (HUMANIZE_CACHE[key]) return HUMANIZE_CACHE[key]
  const label = key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
  HUMANIZE_CACHE[key] = label ? label.replace(/^\w/, (c) => c.toUpperCase()) : key
  return HUMANIZE_CACHE[key]
}

export function ensureSubmissionDisplay(record, defaults = {}) {
  if (!record) return null
  if (record.display) return record.display
  const submittedAt =
    record[defaults.submittedAtKey || 'createdAt'] || record.created_at || record.createdAt || null
  const fields = Object.entries(record)
    .filter(([key]) => key !== 'display')
    .map(([key, value]) => ({
      key,
      label: humanizeKey(key),
      value:
        value === null || value === undefined
          ? '—'
          : typeof value === 'object'
          ? JSON.stringify(value, null, 2)
          : String(value)
    }))
  return {
    meta: {
      formLabel: defaults.formLabel || 'Submission',
      submittedAt,
      source: record.source_page || record.sourcePage || null
    },
    fields,
    attachments: [],
    raw: record,
    summary: {}
  }
}
