using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

/// <summary>
/// Manages the artistic presentation of a Sticky Note.
/// Focuses on readability, smooth transitions, and glassmorphism aesthetics.
/// </summary>
public class StickyNoteVisuals : MonoBehaviour
{
    [Header("UI Components")]
    [SerializeField] private Image backgroundPanel;
    [SerializeField] private TextMeshProUGUI contentText;
    [SerializeField] private CanvasGroup canvasGroup;
    [SerializeField] private RectTransform glowOutline;

    [Header("Aesthetics")]
    [SerializeField] private float glassOpacity = 0.85f;
    [SerializeField] private Color defaultColor = new Color(1f, 0.98f, 0.8f); // Soft Yellow
    [SerializeField] private Color hoverGlowColor = new Color(0.4f, 0.6f, 1f, 0.5f);

    private void Awake()
    {
        // Initialize visuals for "spawn" animation
        if (canvasGroup != null) canvasGroup.alpha = 0f;
        if (glowOutline != null) glowOutline.gameObject.SetActive(false);
        
        // Apply material properties for glass effect if shader supports it
        // Ideally use a shader with "Background Blur" or "GrabPass"
    }

    private void Start()
    {
        AnimateEntrance();
    }

    public void SetContent(string text)
    {
        if (contentText != null) contentText.text = text;
    }

    public void SetColor(Color color)
    {
        if (backgroundPanel != null)
        {
            // Keep the glass opacity consistent regardless of color
            color.a = glassOpacity;
            backgroundPanel.color = color;
        }
    }

    public void OnHoverEnter()
    {
        if (glowOutline != null)
        {
            glowOutline.gameObject.SetActive(true);
            StopAllCoroutines();
            StartCoroutine(FadeCanvas(glowOutline.GetComponent<CanvasGroup>(), 0f, 1f, 0.2f));
        }
        // Haptic feedback suggestion: Play subtle "tick" vibration here
    }

    public void OnHoverExit()
    {
        if (glowOutline != null)
        {
            StartCoroutine(FadeCanvas(glowOutline.GetComponent<CanvasGroup>(), 1f, 0f, 0.2f, () => glowOutline.gameObject.SetActive(false)));
        }
    }

    private void AnimateEntrance()
    {
        // Scale up and fade in for a "pop" effect
        transform.localScale = Vector3.one * 0.8f;
        StartCoroutine(FadeCanvas(canvasGroup, 0f, 1f, 0.4f));
        StartCoroutine(ScaleTo(Vector3.one, 0.4f));
    }

    private IEnumerator FadeCanvas(CanvasGroup cg, float start, float end, float duration, System.Action onComplete = null)
    {
        if (cg == null) yield break;
        float t = 0f;
        while (t < 1f)
        {
            t += Time.deltaTime / duration;
            cg.alpha = Mathf.Lerp(start, end, Mathf.SmoothStep(0f, 1f, t));
            yield return null;
        }
        cg.alpha = end;
        onComplete?.Invoke();
    }

    private IEnumerator ScaleTo(Vector3 targetScale, float duration)
    {
        Vector3 startScale = transform.localScale;
        float t = 0f;
        while (t < 1f)
        {
            t += Time.deltaTime / duration;
            transform.localScale = Vector3.Lerp(startScale, targetScale, Mathf.SmoothStep(0f, 1f, t));
            yield return null;
        }
    }
}
