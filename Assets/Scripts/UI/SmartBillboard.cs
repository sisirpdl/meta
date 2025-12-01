using UnityEngine;

/// <summary>
/// Rotates UI to face the user, but with a "deadzone" to prevent jitter.
/// Essential for comfortable reading in VR.
/// </summary>
public class SmartBillboard : MonoBehaviour
{
    [SerializeField] private Transform targetCamera;
    [SerializeField] private float smoothSpeed = 5f;
    [SerializeField] private float angleThreshold = 15f; // Only update if angle > 15 degrees
    [SerializeField] private bool lockVerticalAxis = false; // Keep UI upright

    private Quaternion targetRotation;
    private bool isGrabbed = false; // Hook this into your Grab Interactable events

    private void Start()
    {
        if (targetCamera == null && Camera.main != null)
        {
            targetCamera = Camera.main.transform;
        }
        targetRotation = transform.rotation;
    }

    private void Update()
    {
        if (targetCamera == null || isGrabbed) return;

        Vector3 directionToCam = targetCamera.position - transform.position;
        
        // If locked vertical, project direction onto XZ plane
        if (lockVerticalAxis)
        {
            directionToCam.y = 0;
        }

        if (directionToCam != Vector3.zero)
        {
            Quaternion lookRot = Quaternion.LookRotation(-directionToCam); // UI usually faces -Z

            // Check angle difference
            float angle = Quaternion.Angle(transform.rotation, lookRot);

            if (angle > angleThreshold)
            {
                targetRotation = lookRot;
            }
        }

        // Smoothly interpolate to the new target rotation
        transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * smoothSpeed);
    }

    // Call these from the Interaction SDK Grab events
    public void OnGrabBegin() => isGrabbed = true;
    public void OnGrabEnd() => isGrabbed = false;
}
