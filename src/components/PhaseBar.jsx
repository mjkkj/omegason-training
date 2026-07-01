import { W, Card, T, Bar } from '../design-system'
import { SCORE_PHASES, phaseScore, overallScore } from '../checklist'
import { useT } from '../i18n'

// Thanh tiến độ điểm checklist: 1 thanh tổng + 3 thanh phase con.
// subByTaskId: { taskId: submission }
export default function PhaseBar({ subByTaskId, compact = false }) {
  const t = useT()
  const overall = overallScore(subByTaskId)
  const tone = overall === 100 ? W.done : W.acc

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Bar pct={overall} h={6} c={tone} style={{ flex: 1 }} />
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: W.mono, width: 38, color: tone }}>{overall}%</span>
      </div>
    )
  }

  return (
    <Card pad={16}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <T size={11} mono c={W.ink3}>{t('TIẾN ĐỘ CHECKLIST')}</T>
        <span style={{ fontSize: 20, fontWeight: 800, color: tone, fontFamily: W.font }}>{overall}%</span>
      </div>
      <Bar pct={overall} h={9} c={tone} style={{ marginBottom: 14 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {SCORE_PHASES.map(p => {
          const pct = phaseScore(subByTaskId, p.taskIds)
          return (
            <div key={p.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{p.key} · {p.name}</span>
                <span style={{ fontSize: 11, color: W.ink3, fontFamily: W.mono }}>{pct}%</span>
              </div>
              <Bar pct={pct} h={6} c={pct === 100 ? W.done : W.acc} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
