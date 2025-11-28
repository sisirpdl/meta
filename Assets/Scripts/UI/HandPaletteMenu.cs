using UnityEngine;
using UnityEngine.Events;
using System.Collections; // Required for IEnumerator

/// <summary>
/// A wrist-mounted palette for spawning notes.
/// Designed for "Poke" interactions to feel tactile.
/// </summary>
public class HandPaletteMenu : MonoBehaviour
{
    [System.Serializable]
    public class ColorEvent : UnityEvent<Color> { }

    [Header("Events")]
    public ColorEvent OnCreateNoteRequest;

    [Header("Debug")]
    [SerializeField] private bool autoSpawnForTesting = true;

    private void Awake()
    {
        // AUTO-FIX: If no event is hooked up, try to find the spawner automatically
        if (OnCreateNoteRequest.GetPersistentEventCount() == 0)
        {
            var spawner = FindObjectOfType<StickyNoteSpawner>();
            if (spawner != null)
            {
                OnCreateNoteRequest.AddListener(spawner.SpawnNote);
                Debug.Log("HandPaletteMenu: Automatically connected to StickyNoteSpawner.");
            }
            else
            {
                Debug.LogError("HandPaletteMenu: No StickyNoteSpawner found in scene! Please create a GameObject and attach StickyNoteSpawner.cs.");
            }
        }
    }

    private void Start()
    {
        if (autoSpawnForTesting)
        {
            StartCoroutine(AutoSpawnRoutine());
        }
    }

    private IEnumerator AutoSpawnRoutine()
    {
        // Wait a moment for the app to load and tracking to stabilize
        yield return new WaitForSeconds(2.0f);
        RequestNewNote(0); // Auto-spawn a note so you see it immediately
        yield return new WaitForSeconds(1.0f);
        RequestNewNote(2); // Spawn another one
    }

    // Call this method from your UI Button's OnClick or OnPoke event
    public void RequestNewNote(int colorIndex)
    {
        if (colorIndex >= 0 && colorIndex < paletteColors.Length)
        {
            Color selectedColor = paletteColors[colorIndex];
            OnCreateNoteRequest?.Invoke(selectedColor);
            
            // Visual feedback: Pulse the menu slightly
            StartCoroutine(PulseMenu());
        }
    }

    private void Update()
    {
        // DEBUG: Keyboard keys (keep for Editor)
        if (Input.GetKeyDown(KeyCode.Alpha1)) RequestNewNote(0);
        if (Input.GetKeyDown(KeyCode.Alpha2)) RequestNewNote(1);
        if (Input.GetKeyDown(KeyCode.Alpha3)) RequestNewNote(2);
        if (Input.GetKeyDown(KeyCode.Alpha4)) RequestNewNote(3);

        // DEBUG: Controller Trigger (Fire1) for standalone testing
        // This allows you to click the trigger to spawn notes without Link
        if (Input.GetButtonDown("Fire1") || Input.GetMouseButtonDown(0))
        {
            RequestNewNote(Random.Range(0, paletteColors.Length));
        }
    }

    private System.Collections.IEnumerator PulseMenu()
    {
        Vector3 originalScale = transform.localScale;
        Vector3 targetScale = originalScale * 0.95f; // Slight shrink on press
        
        float duration = 0.1f;
        float t = 0;
        
        while(t < 1f)
        {
            t += Time.deltaTime / duration;
            transform.localScale = Vector3.Lerp(originalScale, targetScale, t);
            yield return null;
        }
        
        t = 0;
        while(t < 1f)
        {
            t += Time.deltaTime / duration;
            transform.localScale = Vector3.Lerp(targetScale, originalScale, t);
            yield return null;
        }
    }

    [Header("Palette Configuration")]
    // Pastel colors are better for VR readability than saturated ones
    public Color[] paletteColors = new Color[]
    {
        new Color(1f, 0.95f, 0.8f), // Cream
        new Color(0.8f, 0.95f, 0.8f), // Mint
        new Color(0.8f, 0.9f, 1f),    // Sky
        new Color(1f, 0.8f, 0.85f)    // Rose
    };
}
