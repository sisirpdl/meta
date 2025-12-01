using UnityEngine;

/// <summary>
/// Manages the lifecycle and spawning of sticky notes in the scene.
/// Connects the HandPaletteMenu to the actual instantiation logic.
/// </summary>
public class StickyNoteSpawner : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private StickyNoteVisuals notePrefab;
    [SerializeField] private HandPaletteMenu paletteMenu;
    [SerializeField] private Transform headCamera;

    [Header("Spawn Settings")]
    [SerializeField] private float spawnDistance = 0.5f; // Comfortable arm's reach
    [SerializeField] private float verticalOffset = -0.1f; // Slightly below eye level

    private void Start()
    {
        if (headCamera == null) headCamera = Camera.main.transform;

        if (paletteMenu != null)
        {
            paletteMenu.OnCreateNoteRequest.AddListener(SpawnNote);
        }
    }

    private void OnDestroy()
    {
        if (paletteMenu != null)
        {
            paletteMenu.OnCreateNoteRequest.RemoveListener(SpawnNote);
        }
    }

    public void SpawnNote(Color color)
    {
        if (headCamera == null) return;

        // Calculate position: In front of user, slightly down
        Vector3 spawnPos = headCamera.position + (headCamera.forward * spawnDistance);
        spawnPos.y += verticalOffset;

        if (notePrefab != null)
        {
            // Normal spawning
            StickyNoteVisuals newNote = Instantiate(notePrefab, spawnPos, Quaternion.identity);
            newNote.transform.LookAt(headCamera);
            newNote.transform.Rotate(0, 180, 0); // Fix UI rotation (UI looks down -Z usually)
            newNote.SetColor(color);
            newNote.SetContent("New Note");
        }
        else
        {
            // FALLBACK: Spawn a primitive cube if no prefab is assigned
            // This ensures you see SOMETHING even if setup is incomplete
            GameObject debugObj = GameObject.CreatePrimitive(PrimitiveType.Cube);
            debugObj.transform.position = spawnPos;
            debugObj.transform.localScale = new Vector3(0.2f, 0.2f, 0.01f); // Note shape
            debugObj.transform.LookAt(headCamera);

            var renderer = debugObj.GetComponent<Renderer>();
            if (renderer != null) renderer.material.color = color;

            Debug.LogWarning("StickyNoteSpawner: No Prefab assigned! Spawning debug cube.");
        }
    }
}
